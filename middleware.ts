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
      html { background: #070910; }
      body {
        display: grid;
        min-height: 100vh;
        margin: 0;
        place-items: center;
        overflow-x: hidden;
        padding: 32px 20px;
        background:
          radial-gradient(ellipse at 50% 42%, rgba(105, 121, 165, .16), transparent 52%),
          linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px),
          #070910;
        background-size: auto, 48px 48px, 48px 48px, auto;
        color: #f7f8fb;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
      }
      main {
        position: relative;
        isolation: isolate;
        width: min(100%, 720px);
        padding: clamp(32px, 7vw, 68px);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, .13);
        border-radius: 28px;
        background: linear-gradient(145deg, rgba(255,255,255,.09), rgba(255,255,255,.025) 45%, rgba(255,255,255,.045));
        box-shadow:
          0 42px 100px rgba(0,0,0,.62),
          0 18px 36px rgba(0,0,0,.35),
          inset 0 1px 0 rgba(255,255,255,.18),
          inset 0 -1px 0 rgba(255,255,255,.035);
        transform: perspective(1200px) rotateX(2deg);
        animation: card-arrive 800ms cubic-bezier(.2,.8,.2,1) both;
      }
      main::before, main::after {
        position: absolute;
        z-index: -1;
        border-radius: 50%;
        content: "";
        pointer-events: none;
      }
      main::before {
        top: -190px;
        right: -120px;
        width: 390px;
        height: 390px;
        background: radial-gradient(circle, rgba(169, 91, 94, .22), rgba(169, 91, 94, 0) 68%);
      }
      main::after {
        bottom: -240px;
        left: -150px;
        width: 420px;
        height: 420px;
        background: radial-gradient(circle, rgba(91, 119, 169, .2), rgba(91, 119, 169, 0) 68%);
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        margin: 0 0 24px;
        color: #c3c6d0;
        font-family: Consolas, monospace;
        font-size: 11px;
        letter-spacing: .22em;
        text-transform: uppercase;
      }
      .eyebrow::before {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #c47a7d;
        box-shadow: 0 0 14px rgba(196,122,125,.85);
        content: "";
      }
      h1 {
        margin: 0;
        font-size: clamp(38px, 7vw, 64px);
        font-weight: 650;
        letter-spacing: -.065em;
        line-height: 1.05;
        text-shadow: 0 2px 0 rgba(255,255,255,.08), 0 12px 32px rgba(0,0,0,.45);
      }
      .message {
        max-width: 540px;
        margin: 24px auto 0;
        color: #c8cbd5;
        font-size: clamp(16px, 2.4vw, 19px);
        line-height: 1.75;
      }
      .thanks {
        margin: 36px 0 0;
        padding-top: 23px;
        border-top: 1px solid rgba(255,255,255,.12);
        color: #9da3b1;
        font-size: 14px;
        letter-spacing: .015em;
      }
      @keyframes card-arrive {
        from { opacity: 0; transform: perspective(1200px) rotateX(7deg) translateY(18px) scale(.98); }
        to { opacity: 1; transform: perspective(1200px) rotateX(2deg) translateY(0) scale(1); }
      }
      @media (max-width: 520px) {
        main { border-radius: 22px; }
        .eyebrow { margin-bottom: 20px; }
        .message { line-height: 1.65; }
      }
      @media (prefers-reduced-motion: reduce) {
        main { animation: none; }
      }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Project notice</p>
      <h1>ETH Zurich takedown</h1>
      <p class="message">This site has been taken down by ETH Zurich (Eidgenössische Technische Hochschule Zürich), the parent owner and primary developer of Safe Exam Browser (SEB). The project is no longer available.</p>
      <p class="thanks">Thank you for visiting.</p>
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
