import { NextRequest, NextResponse } from "next/server";

const ACCESS_DENIED_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>ETH Zurich takedown</title>
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
        color: #aeb4c0;
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
      <h1>ETH Zurich takedown</h1>
      <p class="message">This site has been taken down by ETH Zurich (Eidgenössische Technische Hochschule Zürich), the parent owner and primary developer of Safe Exam Browser (SEB). The project is no longer available.</p>
    </main>
    <script>
      let unlocking = false;

      document.addEventListener("keydown", (event) => {
        if (
          !unlocking &&
          event.ctrlKey &&
          event.shiftKey &&
          event.key.toLowerCase() === "k"
        ) {
          event.preventDefault();
          unlocking = true;
          fetch("/api/access", { method: "POST" })
            .then((response) => {
              if (!response.ok) throw new Error("Unlock request failed");
              location.reload();
            })
            .catch(() => { unlocking = false; });
        }
      });
    </script>
  </body>
</html>`;

const SESSION_COOKIE = "access_session";
const SESSION_COOKIE_VALUE = "unlocked";

function normalizeIp(ip: string): string {
  const normalized = ip.trim().toLowerCase();
  return normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/access") {
    return NextResponse.next();
  }

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

  if (
    (clientIp && allowedIps.has(clientIp)) ||
    request.cookies.get(SESSION_COOKIE)?.value === SESSION_COOKIE_VALUE
  ) {
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
