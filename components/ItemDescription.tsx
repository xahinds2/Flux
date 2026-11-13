export default function ItemDescription({ text, compact = false }: { text: string; compact?: boolean }) {
  const blocks: { list: boolean; lines: string[] }[] = [];

  for (const line of text.split(/\r?\n/)) {
    const bullet = line.match(/^\s*[*•-]\s+(.+)$/);
    const list = Boolean(bullet);
    const content = bullet ? bullet[1] : line;
    const previous = blocks[blocks.length - 1];
    if (previous?.list === list) {
      previous.lines.push(content);
    } else {
      blocks.push({ list, lines: [content] });
    }
  }

  return (
    <div className={compact ? "space-y-1 text-sm text-slate-600" : "space-y-2 text-slate-700"}>
      {blocks.map((block, index) => block.list ? (
        <ul key={index} className="list-disc space-y-0.5 pl-5">
          {block.lines.map((line, lineIndex) => <li key={lineIndex} className="break-words">{line}</li>)}
        </ul>
      ) : (
        <p key={index} className={`whitespace-pre-wrap break-words ${compact ? "line-clamp-2" : ""}`}>{block.lines.join("\n")}</p>
      ))}
    </div>
  );
}
