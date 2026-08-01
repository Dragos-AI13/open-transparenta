const domainColors: Record<string, string> = {
  buget: "#10b981",
  sanatate: "#f43f5e",
  educatie: "#3b82f6",
  justitie: "#8b5cf6",
  administratie: "#14b8a6",
  companii: "#f97316",
  achizitii: "#eab308",
  mediu: "#22c55e",
  transport: "#06b6d4",
  munca: "#ec4899",
  siguranta: "#ef4444",
  agricultura: "#84cc16",
  energie: "#f59e0b",
  cultura: "#a855f7",
  statistici: "#6366f1",
  telecom: "#0ea5e9",
  externe: "#64748b",
};

const domains: { name: string; slug: string; href?: string }[] = [
  { name: "Buget și Finanțe", slug: "buget", href: "/buget-si-finante" },
  { name: "Sănătate", slug: "sanatate" },
  { name: "Educație", slug: "educatie" },
  { name: "Justiție", slug: "justitie" },
  { name: "Administrație", slug: "administratie" },
  { name: "Companii și Comerț", slug: "companii", href: "/companii" },
  { name: "Achiziții Publice", slug: "achizitii" },
  { name: "Mediu", slug: "mediu" },
  { name: "Transport", slug: "transport" },
  { name: "Muncă și Social", slug: "munca" },
  { name: "Siguranță și Ordine", slug: "siguranta" },
  { name: "Agricultură", slug: "agricultura" },
  { name: "Energie", slug: "energie" },
  { name: "Cultură și Patrimoniu", slug: "cultura" },
  { name: "Statistici și Populație", slug: "statistici" },
  { name: "Telecomunicații", slug: "telecom" },
  { name: "Externe", slug: "externe" },
];

export function DomainGrid() {
  return (
    <section className="w-full max-w-4xl px-4">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm font-medium text-text-secondary">Domenii</h2>
        <span className="text-xs text-text-muted">
          {domains.length} surse de date
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {domains.map((domain) => {
          const isImplemented = !!domain.href;
          return (
            <a
              key={domain.slug}
              href={domain.href || "#"}
              className={`group flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-surface px-3 py-2.5 transition-all ${
                isImplemented
                  ? "cursor-pointer hover:border-border-default hover:bg-bg-elevated"
                  : "cursor-default opacity-60 hover:border-border-subtle hover:bg-bg-surface"
              }`}
              {...(!isImplemented ? { onClick: (e) => e.preventDefault() } : {})}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: domainColors[domain.slug] }}
              />
              <span className="truncate text-sm text-text-secondary transition-colors group-hover:text-text-primary">
                {domain.name}
              </span>
              {!isImplemented && (
                <span className="shrink-0 text-[10px] text-text-muted">🔜</span>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
