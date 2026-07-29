"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DomainSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/companii/cauta?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <svg
        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Caută o firmă după nume, CUI sau domeniu de activitate..."
        className="w-full rounded-lg border border-border-subtle bg-bg-surface py-2.5 pl-10 pr-24 text-sm text-text-primary placeholder-text-muted transition-all focus:border-border-default focus:bg-bg-elevated focus:shadow-search focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-accent-primary px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-accent-hover"
      >
        Caută
      </button>
    </form>
  );
}
