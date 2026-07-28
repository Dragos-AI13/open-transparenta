"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Companii", href: "/companii" },
  { label: "Domenii", href: "#" },
  { label: "Despre", href: "#" },
  { label: "GitHub", href: "https://github.com/Dragos-AI13/open-transparenta" },
];

export function Header() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "#") return false;
    if (href === "/companii") {
      return pathname.startsWith("/companii");
    }
    return pathname === href;
  }

  return (
    <header className="border-b border-border-subtle">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-text-primary">
            OT
          </span>
          <span className="hidden text-sm font-semibold text-text-primary sm:inline">
            Open Transparență
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-bg-elevated text-text-primary"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
