import Link from "next/link";
import { Fragment } from "react";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-muted">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;

        return (
          <Fragment key={i}>
            {i > 0 && <span className="text-text-muted select-none">›</span>}
            {isLast || !seg.href ? (
              <span
                className={
                  isLast ? "text-text-secondary font-medium" : "text-text-muted"
                }
              >
                {seg.label}
              </span>
            ) : (
              <Link
                href={seg.href}
                className="transition-colors hover:text-text-primary"
              >
                {seg.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
