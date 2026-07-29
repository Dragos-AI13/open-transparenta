"use client";

import { DomainGrid } from "@/components/DomainGrid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
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
    <div className="flex flex-1 flex-col items-center">
      {/* Hero Section */}
      <section className="flex w-full max-w-2xl flex-col items-center px-4 pt-24 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Open Transparență
        </h1>
        <p className="mt-3 max-w-md text-lg text-text-secondary">
          Caută orice dată publică din România. Instant. Gratuit.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-8 w-full">
          <div className="relative">
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
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută bugete, firme, spitale, licitații..."
              className="w-full rounded-xl border border-border-subtle bg-bg-surface py-3.5 pl-12 pr-4 text-text-primary placeholder-text-muted transition-all focus:border-border-default focus:bg-bg-elevated focus:shadow-search focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-accent-primary px-3 py-1 text-xs font-medium text-white transition-all hover:bg-accent-hover"
            >
              Caută
            </button>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Peste 4 milioane de firme și 5.000 de seturi de date din surse oficiale
          </p>
        </form>
      </section>

      {/* Domain Grid */}
      <div className="pb-16">
        <DomainGrid />
      </div>
    </div>
  );
}
