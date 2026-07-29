"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { companiiCategories } from "@/lib/companii-domains";

export function DomainSidebar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const activeSlug = segments[1] ?? null;
  const isCauta = segments[1] === "cauta";

  return (
    <aside className="flex w-full flex-col gap-1 md:w-56 md:shrink-0">
      {/* Section title */}
      <Link
        href="/companii"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          !activeSlug
            ? "bg-bg-elevated text-text-primary"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <span className="text-base">📋</span>
        Toate datele
      </Link>

      {/* Search link */}
      <Link
        href="/companii/cauta"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
          isCauta
            ? "bg-bg-elevated font-medium text-text-primary"
            : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
        }`}
      >
        <span className="text-base">🔍</span>
        <span className="truncate">Căutare firmă</span>
      </Link>

      <div className="mb-2 mt-1 h-px bg-border-subtle" />

      {/* Category links */}
      {companiiCategories.map((cat) => {
        const href = `/companii/${cat.slug}`;
        const isActive = activeSlug === cat.slug;

        return (
          <Link
            key={cat.slug}
            href={href}
            className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive
                ? "bg-bg-elevated font-medium text-text-primary"
                : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
            }`}
            style={
              isActive
                ? { borderLeft: `3px solid ${cat.color}`, paddingLeft: "9px" }
                : undefined
            }
          >
            <span className="text-base">{cat.icon}</span>
            <span className="truncate">{cat.name}</span>
          </Link>
        );
      })}
    </aside>
  );
}
