import Link from "next/link";
import { companiiCategories } from "@/lib/companii-domains";
import { DomainSearch } from "@/components/companii/DomainSearch";

export default function CompaniiPage() {
  const visibleCategories = companiiCategories.filter((c) => !c.hidden);
  const totalSources = visibleCategories.reduce(
    (sum, c) => sum + c.sourceCount,
    0,
  );
  const totalInstitutions = new Set(
    visibleCategories.flatMap((c) => c.keyInstitutions),
  ).size;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          🏢 Companii și Comerț
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-text-secondary sm:text-base">
          Toate datele publice despre firmele din România — de la Registrul
          Comerțului la situații financiare, întreprinderi publice și
          concurență.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
          <span>
            <strong className="text-text-secondary">
              {visibleCategories.length}
            </strong>{" "}
            categorii live
          </span>
          <span>
            <strong className="text-text-secondary">{totalSources}+</strong>{" "}
            seturi de date
          </span>
          <span>
            <strong className="text-text-secondary">
              {totalInstitutions}
            </strong>{" "}
            instituții
          </span>
        </div>

        {/* Domain Search */}
        <div className="mt-5">
          <DomainSearch />
        </div>
      </section>

      {/* Category Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/companii/${cat.slug}`}
            className="group rounded-xl border border-border-subtle bg-bg-surface p-4 transition-all hover:border-border-default hover:bg-bg-elevated"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: `${cat.color}1a` }}
              >
                {cat.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-text-primary group-hover:text-text-primary">
                  {cat.name}
                </h3>
                <p className="mt-0.5 text-xs text-text-muted line-clamp-2">
                  {cat.shortDesc}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
              <span>{cat.sourceCount} seturi</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.keyInstitutions[0]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
