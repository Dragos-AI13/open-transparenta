"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/companii/cauta?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
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
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Caută o firmă după nume, CUI sau domeniu de activitate..."
        className="w-full rounded-xl border border-border-subtle bg-bg-surface py-3 pl-12 pr-28 text-text-primary placeholder-text-muted transition-all focus:border-border-default focus:bg-bg-elevated focus:shadow-search focus:outline-none"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
        <button
          type="submit"
          className="rounded-lg bg-accent-primary px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-accent-hover"
        >
          Caută
        </button>
      </div>
    </form>
  );
}
