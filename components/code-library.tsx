"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Code2, Copy, FileCode2, Loader2, Search } from "lucide-react";

type SourceFile = { name: string; code: string };
type Problem = { number: number; title: string; experiment: number; files: SourceFile[] };

function parseProblems(raw: string): Problem[] {
  const headings = Array.from(raw.matchAll(/^Problem (\d+): (.+)$/gm));
  return headings.map((heading, index) => {
    const number = Number(heading[1]);
    const start = heading.index! + heading[0].length;
    const end = index + 1 < headings.length ? headings[index + 1].index! : raw.length;
    const section = raw.slice(start, end);
    const fileMarkers = Array.from(section.matchAll(/^FILE:\s*(.+)\r?\n-{3,}[ \t]*\r?\n/gm));
    const files = fileMarkers.map((file, fileIndex) => {
      const from = file.index! + file[0].length;
      const to = fileIndex + 1 < fileMarkers.length ? fileMarkers[fileIndex + 1].index! : section.length;
      let code = section.slice(from, to).replace(/\r\n/g, "\n");
      code = code.replace(/\n+={15,}\s*$/, "").trimEnd();
      return { name: file[1].trim(), code };
    });
    const experiment = number <= 5 ? 7 : number <= 12 ? 8 : number <= 17 ? 9 : 10;
    return { number, title: heading[2].trim(), experiment, files };
  });
}

const keywordPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*$|\b(?:import|export|from|default|const|let|var|function|async|await|return|new|if|else|try|catch|finally|throw|class|extends|true|false|null|undefined|typeof|while|for|of|in|switch|case|break|continue)\b|\b\d+\b)/gm;

function highlighted(line: string) {
  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  const regex = new RegExp(keywordPattern.source, "g");
  for (const match of line.matchAll(regex)) {
    const offset = match.index ?? 0;
    if (offset > cursor) pieces.push(line.slice(cursor, offset));
    const value = match[0];
    const color = value.startsWith("//")
      ? "text-[#7f8295]"
      : /^[\x22\x27`]/.test(value)
        ? "text-[#a3e6b7]"
        : /^\d+$/.test(value)
          ? "text-[#ffc78c]"
          : "text-[#c4a6ff]";
    pieces.push(<span key={offset} className={color}>{value}</span>);
    cursor = offset + value.length;
  }
  if (cursor < line.length) pieces.push(line.slice(cursor));
  return pieces.length ? pieces : " ";
}

export default function CodeLibrary() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeNumber, setActiveNumber] = useState(1);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/problems.txt")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the source code file.");
        return response.text();
      })
      .then((content) => {
        const parsed = parseProblems(content);
        if (parsed.length !== 18 || parsed.some((problem) => problem.files.length === 0)) {
          throw new Error("The data file does not contain all 18 complete problem entries.");
        }
        if (mounted) setProblems(parsed);
      })
      .catch((cause: unknown) => {
        if (mounted) setError(cause instanceof Error ? cause.message : "Failed to load problems.");
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const selected = problems.find((problem) => problem.number === activeNumber) ?? problems[0];
  const currentFile = selected?.files[activeFile] ?? selected?.files[0];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return problems.filter((problem) => !term || `${problem.number} ${problem.title} ${problem.experiment} ${problem.files.map((file) => file.name).join(" ")}`.toLowerCase().includes(term));
  }, [problems, search]);

  function choose(number: number) {
    setActiveNumber(number);
    setActiveFile(0);
    setCopied(false);
  }

  async function copyCode() {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="code-library" className="relative border-t border-white/10 bg-[#0a0a10] px-4 py-20 sm:px-6 lg:px-10" aria-label="Programming problems and source code">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#69e6ff]">
            <Code2 size={16} /> Code archive
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">All 18 problems. One workspace.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Browse the original submitted source code from Experiments 7–10. Select a problem, switch between its files, and copy the code instantly.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/[0.12] bg-[#101018] shadow-[0_25px_90px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80"><FileCode2 size={17} className="text-[#9b7bff]" /> Problem explorer</div>
            <span className="rounded-full border border-[#69e6ff]/20 bg-[#69e6ff]/10 px-3 py-1 font-mono text-xs text-[#69e6ff]">{problems.length || 18} problems</span>
          </div>

          {loading ? (
            <div className="flex min-h-[340px] items-center justify-center gap-3 text-white/60"><Loader2 size={20} className="animate-spin" /> Loading original code…</div>
          ) : error ? (
            <div className="p-10 text-center text-[#ffc2c2]" role="alert">{error}</div>
          ) : (
            <div className="grid min-h-[580px] lg:grid-cols-[290px_minmax(0,1fr)]">
              <aside className="border-b border-white/10 bg-black/15 lg:border-b-0 lg:border-r" aria-label="Problem navigation">
                <div className="p-4">
                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 focus-within:border-[#9b7bff]/70">
                    <Search size={16} className="shrink-0 text-white/40" />
                    <input aria-label="Search problems" type="search" placeholder="Search problems…" value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35" />
                  </label>
                </div>
                <div className="max-h-[360px] overflow-y-auto px-2 pb-4 lg:max-h-[650px]">
                  {[7, 8, 9, 10].map((experiment) => {
                    const list = filtered.filter((problem) => problem.experiment === experiment);
                    if (!list.length) return null;
                    return (
                      <div key={experiment} className="mb-4">
                        <div className="px-3 pb-2 pt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">Experiment {experiment}</div>
                        {list.map((problem) => (
                          <button type="button" key={problem.number} onClick={() => choose(problem.number)} aria-current={selected?.number === problem.number ? "true" : undefined}
                            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selected?.number === problem.number ? "border border-[#9b7bff]/30 bg-[#9b7bff]/15 text-white" : "border border-transparent text-white/55 hover:bg-white/[0.055] hover:text-white"}`}>
                            <span className="w-7 shrink-0 font-mono text-xs text-[#a9a1c7]">{String(problem.number).padStart(2, "0")}</span>
                            <span className="min-w-0 flex-1 truncate text-[13px]" title={problem.title}>{problem.title}</span>
                            <ChevronRight size={14} className="shrink-0 opacity-50" />
                          </button>
                        ))}
                      </div>
                    );
                  })}
                  {!filtered.length && <p className="px-3 py-5 text-sm text-white/40">No matching problems.</p>}
                </div>
              </aside>

              <div className="min-w-0">
                {selected && currentFile && (
                  <>
                    <header className="border-b border-white/10 px-5 py-5 sm:px-7">
                      <div className="mb-2 font-mono text-xs text-[#69e6ff]">EXPERIMENT {selected.experiment} / PROBLEM {String(selected.number).padStart(2, "0")}</div>
                      <h3 className="text-xl font-semibold text-white sm:text-2xl">{selected.title}</h3>
                      <p className="mt-2 text-xs text-white/40">{selected.files.length} source {selected.files.length === 1 ? "file" : "files"} · Original submission</p>
                    </header>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 pt-3 sm:px-6">
                      <div className="flex max-w-full gap-2 overflow-x-auto" role="tablist" aria-label="Source files">
                        {selected.files.map((file, index) => (
                          <button key={file.name + index} type="button" role="tab" aria-selected={activeFile === index} onClick={() => { setActiveFile(index); setCopied(false); }}
                            className={`whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2 font-mono text-xs transition-colors ${activeFile === index ? "border-[#69e6ff] bg-white/[0.06] text-white" : "border-transparent text-white/45 hover:text-white/80"}`}>
                            {file.name}
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={copyCode} className="mb-2 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.12]">
                        {copied ? <Check size={14} className="text-[#79f6b1]" /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy code"}
                      </button>
                    </div>
                    <div role="tabpanel" className="max-h-[530px] overflow-auto bg-[#0b0c13] py-4">
                      <pre className="w-max min-w-full font-mono text-[12px] leading-[1.85] text-[#d6d8e6] sm:text-[13px]">
                        <code>{currentFile.code.split("\n").map((line, index) => (
                          <span key={index} className="flex min-w-full pr-6 hover:bg-white/[0.025]">
                            <span aria-hidden="true" className="sticky left-0 mr-5 inline-block w-12 shrink-0 select-none border-r border-white/[0.06] bg-[#0b0c13] pr-3 text-right text-white/25">{index + 1}</span>
                            <span className="whitespace-pre">{highlighted(line)}</span>
                          </span>
                        ))}</code>
                      </pre>
                    </div>
                    <footer className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-[11px] text-white/35 sm:px-7">
                      <span>{currentFile.name}</span><span>{currentFile.code.split("\n").length} lines · Read only</span>
                    </footer>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
