"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Build page numbers to show
  const pages = useMemo(() => {
    const result: (number | "...")[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        result.push(i);
      } else if (result[result.length - 1] !== "...") {
        result.push("...");
      }
    }
    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginare">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-secondary transition-all hover:border-border-default hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Precedenta
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="px-2 text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                p === currentPage
                  ? "bg-accent-primary text-white shadow-sm"
                  : "border border-border-subtle bg-bg-surface text-text-secondary hover:border-border-default hover:text-text-primary"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-secondary transition-all hover:border-border-default hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Următoarea →
      </button>

      <span className="ml-2 text-xs text-text-muted">
        Pagina {currentPage} din {totalPages}
      </span>
    </nav>
  );
}
