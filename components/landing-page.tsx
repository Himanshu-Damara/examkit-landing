"use client";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-6 text-center text-white">
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.5em] text-red-400/80">
          505 Not Found
        </p>
        <h1 className="text-4xl font-bold tracking-[-0.06em] sm:text-6xl">
          Access Denied
        </h1>
        <p className="mt-5 text-base text-white/70 sm:text-xl">
          Please change your network
        </p>
      </div>
    </main>
  );
}
