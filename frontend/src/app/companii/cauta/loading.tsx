export default function SearchLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8">
      {/* Filters skeleton */}
      <aside className="w-72 shrink-0 space-y-6">
        <div className="h-4 w-16 animate-pulse rounded bg-bg-elevated" />
        <div className="space-y-2">
          <div className="h-3 w-12 animate-pulse rounded bg-bg-elevated" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-bg-elevated" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-bg-elevated" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-bg-elevated" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-bg-elevated" />
            <div className="h-3 w-20 animate-pulse rounded bg-bg-elevated" />
          </div>
        ))}
      </aside>

      {/* Results skeleton */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-6">
          <div className="h-10 w-full animate-pulse rounded-xl bg-bg-elevated" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-28 w-full animate-pulse rounded-xl bg-bg-elevated"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
