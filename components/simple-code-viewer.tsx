"use client";

import { useState } from "react";

export type CodeProblem = {
  number: number;
  title: string;
  files: { name: string; code: string }[];
};

const rawSourceUrl = "https://raw.githubusercontent.com/Himanshu-Damara/examkit-landing/main/public/problems.txt";

export default function SimpleCodeViewer({ problems }: { problems: CodeProblem[] }) {
  const [selectedNumber, setSelectedNumber] = useState(problems[0]?.number ?? 1);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const selected = problems.find((problem) => problem.number === selectedNumber) ?? problems[0];
  const selectedIndex = problems.findIndex((problem) => problem.number === selected.number);
  const currentFile = selected.files[selectedFileIndex] ?? selected.files[0];

  function selectProblem(number: number) {
    setSelectedNumber(number);
    setSelectedFileIndex(0);
  }

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold text-white">All 18 Problem Codes</h1>
      <p className="mb-3 text-sm text-white/60">Choose a problem to view its complete code.</p>
      <a
        href={rawSourceUrl}
        target="_blank"
        rel="noopener noreferrer alternate"
        type="text/plain"
        className="mb-7 inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/[0.08] px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/15"
      >
        AI-readable source (all 18 programs, TXT) ↗
      </a>

      <nav aria-label="Choose a problem" className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {problems.map((problem) => (
          <button
            key={problem.number}
            type="button"
            title={problem.title}
            onClick={() => selectProblem(problem.number)}
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

      <section className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          {selected.number}. {selected.title}
        </h2>

        <div className="mb-3 flex flex-wrap gap-2 border-b border-white/10 pb-3" role="tablist" aria-label="Source files">
          {selected.files.map((file, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={currentFile === file}
              onClick={() => setSelectedFileIndex(index)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                currentFile === file
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-white/10 bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>

        {currentFile && (
          <div role="tabpanel">
            <pre className="max-h-[680px] overflow-auto rounded-lg border border-white/10 bg-[#111118] p-4 font-mono text-xs leading-6 text-white/90 sm:text-sm">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        )}

        <div className="mt-7 flex justify-between gap-3">
          <button
            type="button"
            disabled={selectedIndex <= 0}
            onClick={() => selectProblem(problems[selectedIndex - 1].number)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-30"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={selectedIndex >= problems.length - 1}
            onClick={() => selectProblem(problems[selectedIndex + 1].number)}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
