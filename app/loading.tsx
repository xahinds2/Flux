export default function Loading() {
  return (
    <div className="grid animate-pulse gap-3 lg:grid-cols-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="aspect-square w-28 shrink-0 rounded-lg bg-slate-200 sm:w-36" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="mt-auto h-5 w-20 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
