export default function CallButton({ number, name, compact = false }: { number: string; name: string; compact?: boolean }) {
  return (
    <a
      href={`tel:+${number}`}
      aria-label={`Call ${name}`}
      title={`Call ${name}`}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-600 text-white transition-colors hover:border-green-700 hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${compact ? "h-8 w-8" : "px-4 py-3 font-semibold"}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </svg>
      {!compact && "Call"}
    </a>
  );
}
