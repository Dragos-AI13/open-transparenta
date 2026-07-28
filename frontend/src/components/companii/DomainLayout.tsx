"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DomainSidebar } from "./DomainSidebar";
import { Breadcrumb } from "./Breadcrumb";
import { companiiCategories } from "@/lib/companii-domains";

export function DomainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb segments from path
  const breadcrumbSegments = segments.map((seg, i) => {
    if (i === 0) {
      return { label: "Companii și Comerț", href: "/companii" };
    }
    const category = companiiCategories.find((c) => c.slug === seg);
    if (category) {
      return { label: category.name };
    }
    return { label: seg.replace(/-/g, " ") };
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 md:flex-row md:gap-8 md:px-6">
      {/* Desktop Sidebar — sticky */}
      <div className="hidden shrink-0 md:block">
        <nav className="sticky top-6 w-56">
          <DomainSidebar />
        </nav>
      </div>

      {/* Mobile layout header */}
      <div className="mb-3 flex items-center gap-3 md:hidden">
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          aria-label="Deschide categorii"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <span>Categorii</span>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Slide-in panel */}
          <div className="absolute left-0 top-0 h-full w-64 animate-slide-up bg-bg-deep p-4 shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">
                Categorii
              </span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
                aria-label="Închide categorii"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <DomainSidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Breadcrumb segments={breadcrumbSegments} />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  );
}
