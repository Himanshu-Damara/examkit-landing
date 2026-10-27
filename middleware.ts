import { NextRequest, NextResponse } from "next/server";

const ACCESS_DENIED_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Access Denied</title>
    <style>
      * { box-sizing: border-box; }
      html, body { min-height: 100%; }
      body {
        display: grid;
        min-height: 100vh;
        margin: 0;
        place-items: center;
        background: #080b11;
        color: #f7f8fb;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
      }
      main { padding: 32px 20px; }
      p {
        margin: 0 0 14px;
        color: #ff454d;
        font-family: Consolas, monospace;
        font-size: 12px;
        letter-spacing: .55em;
      }
      h1 { margin: 0; font-size: clamp(40px, 7vw, 60px); letter-spacing: -.06em; }
      .message { margin: 20px 0 0; color: #d3d5dc; font-size: 20px; letter-spacing: 0; }
    </style>
  </head>
  <body>
    <main>
      <p>505 NOT FOUND</p>
      <h1>Access Denied</h1>
      <p class="message">Please change your network</p>
    </main>
  </body>
</html>`;

function normalizeIp(ip: string): string {
  const normalized = ip.trim().toLowerCase();
  return normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const allowedIps = new Set(
    (process.env.ACCESS_ALLOWED_IPS ?? "")
      .split(",")
      .map(normalizeIp)
      .filter(Boolean),
  );
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor
    ? normalizeIp(forwardedFor.split(",").at(-1) ?? "")
    : "";

  if (clientIp && allowedIps.has(clientIp)) {
    return NextResponse.next();
  }

  return new Response(ACCESS_DENIED_PAGE, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
