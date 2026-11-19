"use client";

import { useState } from "react";

export type CodeProblem = {
  number: number;
  title: string;
  files: { name: string; code: string }[];
};

export default function SimpleCodeViewer({ problems }: { problems: CodeProblem[] }) {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const selected = problems.find((problem) => problem.number === selectedNumber) ?? problems[0];

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold text-white">All 18 Problem Codes</h1>
      <p className="mb-6 text-sm text-white/60">Choose a problem below to view its complete code.</p>

      <nav aria-label="Choose a problem" className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {problems.map((problem) => (
          <button
            key={problem.number}
            type="button"
            title={problem.title}
            onClick={() => setSelectedNumber(problem.number)}
            aria-pressed={selected.number === problem.number}
            className={`rounded-lg border px-3 py-3 text-left transition-colors ${
              selected.number === problem.number
                ? "border-violet bg-violet/20 text-white"
                : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white"
            }`}
          >
            <span className="block text-sm font-semibold">Problem {problem.number}</span>
            <span className="mt-1 block truncate text-xs opacity-70">{problem.title}</span>
          </button>
        ))}
      </nav>

      <section aria-live="polite" className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold text-white">
          {selected.number}. {selected.title}
        </h2>
        {selected.files.map((file, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <h3 className="mb-2 font-mono text-sm text-white/70">{file.name}</h3>
            <pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#111118] p-4 font-mono text-xs leading-6 text-white/90 sm:text-sm">
              <code>{file.code}</code>
            </pre>
          </div>
        ))}
        <div className="mt-7 flex justify-between gap-3">
          <button
            type="button"
            disabled={selected.number === problems[0].number}
            onClick={() => setSelectedNumber(problems[Math.max(0, problems.findIndex((p) => p.number === selected.number) - 1)].number)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-30"
          >Previous</button>
          <button
            type="button"
            disabled={selected.number === problems[problems.length - 1].number}
            onClick={() => setSelectedNumber(problems[Math.min(problems.length - 1, problems.findIndex((p) => p.number === selected.number) + 1)].number)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-30"
          >Next</button>
        </div>
      </section>
    </div>
  );
}
