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
      .hint { margin: 18px 0 0; color: #777d8a; font-size: 12px; letter-spacing: 0; }
      #access-dialog {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 20px;
        background: rgba(0, 0, 0, .72);
      }
      #access-dialog[hidden] { display: none; }
      form {
        width: min(100%, 360px);
        padding: 28px;
        border: 1px solid rgba(255, 255, 255, .14);
        border-radius: 16px;
        background: #10131b;
        text-align: left;
      }
      label { display: block; margin-bottom: 10px; font-size: 14px; }
      input, button {
        width: 100%;
        border: 1px solid rgba(255, 255, 255, .18);
        border-radius: 8px;
        padding: 12px;
        font: inherit;
      }
      input { background: #080b11; color: #f7f8fb; }
      button { margin-top: 12px; background: #f7f8fb; color: #080b11; cursor: pointer; font-weight: 700; }
      #error { min-height: 20px; margin: 10px 0 0; color: #ff777d; font-size: 13px; letter-spacing: 0; }
    </style>
  </head>
  <body>
    <main>
      <p>505 NOT FOUND</p>
      <h1>Access Denied</h1>
      <p class="message">Please change your network</p>
      <p class="hint">Press Ctrl+Shift+K to enter an access code</p>
    </main>
    <div id="access-dialog" hidden>
      <form id="access-form">
        <label for="access-code">Enter access code</label>
        <input id="access-code" name="code" type="password" autocomplete="current-password" required>
        <button type="submit">Unlock</button>
        <p id="error" role="status" aria-live="polite"></p>
      </form>
    </div>
    <script>
      const dialog = document.getElementById("access-dialog");
      const form = document.getElementById("access-form");
      const codeInput = document.getElementById("access-code");
      const error = document.getElementById("error");

      document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "k") {
          event.preventDefault();
          dialog.hidden = false;
          codeInput.focus();
        }
        if (event.key === "Escape") dialog.hidden = true;
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.textContent = "";
        const button = form.querySelector("button");
        button.disabled = true;
        try {
          const response = await fetch("/api/access", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code: codeInput.value })
          });
          if (!response.ok) {
            error.textContent = response.status === 503
              ? "Access code is not configured."
              : "Invalid access code.";
            return;
          }
          location.reload();
        } catch {
          error.textContent = "Could not verify the access code. Try again.";
        } finally {
          button.disabled = false;
        }
      });
    </script>
  </body>
</html>`;

const SESSION_COOKIE = "access_session";

function normalizeIp(ip: string): string {
  const normalized = ip.trim().toLowerCase();
  return normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
}

async function hasValidAccessSession(request: NextRequest): Promise<boolean> {
  const accessCode = process.env.ACCESS_CODE;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!accessCode || !token) return false;

  const [expiresAtText, signature, ...extra] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (
    extra.length > 0 ||
    !/^\d{13}$/.test(expiresAtText) ||
    !/^[a-f0-9]{64}$/.test(signature) ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Date.now()
  ) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(accessCode),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(expiresAtText),
  );
  const expected = Array.from(new Uint8Array(signed), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  }
  return difference === 0;
}

export async function middleware(request: NextRequest) {
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
    (await hasValidAccessSession(request))
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
