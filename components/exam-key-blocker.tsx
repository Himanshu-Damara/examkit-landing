"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function ExamKeyBlocker() {
  const [status, setStatus] = useState("");

  async function copyScript() {
    try {
      const response = await fetch("/temporary-exam-key-blocker.ps1");
      if (!response.ok) throw new Error("Could not load the script");
      const script = await response.text();
      await navigator.clipboard.writeText(script);
      setStatus("Script copied to clipboard.");
    } catch {
      setStatus("Copy failed. Open this page over HTTPS and allow clipboard access.");
    }
  }

  return (
    <section className="relative z-10 border-t border-white/[0.08] bg-[#0b0b10] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-10">
        <p className="section-kicker">Optional PowerShell utility</p>
        <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
          Temporary exam key blocker
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
          Copy the provided Windows PowerShell script to your clipboard. It installs a low-level keyboard hook and blocks the Windows keys and Alt+Tab/Ctrl+Tab while it is running. It does not run automatically from this site.
        </p>
        <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-100/80">
          Use only on a device you own or are authorized to administer, with the affected user informed. Blocking system shortcuts can interrupt normal access to the computer. Ctrl+Alt+F12 exits the script.
        </div>
        <button
          type="button"
          onClick={copyScript}
          className="button-primary focus-ring mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black"
        >
          {status === "Script copied to clipboard." ? <Check size={16} /> : <Copy size={16} />}
          Copy PowerShell script
        </button>
        <p className="mt-3 min-h-5 text-sm text-white/50" aria-live="polite">{status}</p>
      </div>
    </section>
  );
}
