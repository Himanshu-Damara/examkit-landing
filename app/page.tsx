import { readFile } from "node:fs/promises";
import path from "node:path";
import SimpleCodeViewer from "@/components/simple-code-viewer";

type SourceFile = { name: string; code: string };
type Problem = { number: number; title: string; files: SourceFile[] };

function parseCodes(text: string): Problem[] {
  const headings = Array.from(text.matchAll(/^Problem (\d+): (.+)$/gm));
  return headings.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length;
    const end = index + 1 < headings.length ? headings[index + 1].index : text.length;
    const section = text.slice(start, end);
    const markers = Array.from(section.matchAll(/^FILE:\s*(.+)\r?\n-{3,}[ \t]*\r?\n/gm));
    const files = markers.map((marker, fileIndex) => {
      const fileStart = (marker.index ?? 0) + marker[0].length;
      const fileEnd = fileIndex + 1 < markers.length ? markers[fileIndex + 1].index : section.length;
      const code = section.slice(fileStart, fileEnd).replace(/\n+={15,}\s*$/, "").trimEnd();
      return { name: marker[1].trim(), code };
    });
    return { number: Number(heading[1]), title: heading[2].trim(), files };
  });
}

export default async function Home() {
  const source = await readFile(path.join(process.cwd(), "public", "problems.txt"), "utf8");
  const problems = parseCodes(source);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <SimpleCodeViewer problems={problems} />
    </main>
  );
}
