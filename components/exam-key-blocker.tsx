"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy } from "lucide-react";

export default function ExamKeyBlocker() {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hero = document.querySelector("main#home > section");
    const downloadButton = Array.from(hero?.querySelectorAll("a, span") ?? []).find(
      (element) => element.textContent?.trim().startsWith("Download package"),
    );

    if (!downloadButton?.parentElement) return;

    const portalMount = document.createElement("span");
    portalMount.style.display = "contents";
    downloadButton.insertAdjacentElement("afterend", portalMount);
    setMount(portalMount);

    return () => portalMount.remove();
  }, []);

  async function copyScript() {
    try {
      const response = await fetch("/temporary-exam-key-blocker.ps1");
      if (!response.ok) throw new Error("Could not load script");
      await navigator.clipboard.writeText(await response.text());
      setCopied(true);
      setError("");
    } catch {
      setCopied(false);
      setError("Copy failed. Allow clipboard access and try again.");
    }
  }

  if (!mount) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={copyScript}
        title="Copies the script only; it does not run it. The script blocks system shortcuts while active."
        className="button-secondary focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied!" : "Copy script"}
      </button>
      <span className="sr-only" aria-live="polite">{error}</span>
    </>,
    mount,
  );
}
