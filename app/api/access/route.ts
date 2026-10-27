import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "access_session";
const SESSION_DURATION_SECONDS = 12 * 60 * 60;

export async function POST(request: NextRequest) {
  const accessCode = process.env.ACCESS_CODE;
  if (!accessCode) {
    return NextResponse.json(
      { error: "Access code is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let submittedCode: unknown;
  try {
    const body: unknown = await request.json();
    submittedCode =
      typeof body === "object" && body !== null && "code" in body
        ? body.code
        : undefined;
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    typeof submittedCode !== "string" ||
    submittedCode.length > 256 ||
    Buffer.byteLength(submittedCode) !== Buffer.byteLength(accessCode)
  ) {
    return NextResponse.json(
      { error: "Invalid access code." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const submittedBuffer = Buffer.from(submittedCode);
  const configuredBuffer = Buffer.from(accessCode);
  if (!timingSafeEqual(submittedBuffer, configuredBuffer)) {
    return NextResponse.json(
      { error: "Invalid access code." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const expiresAtText = String(expiresAt);
  const signature = createHmac("sha256", accessCode)
    .update(expiresAtText)
    .digest("hex");
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(SESSION_COOKIE, `${expiresAtText}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  return response;
}
