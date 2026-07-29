import { notFound } from "next/navigation";
import { getCategoryExtended, getAllCategorySlugs } from "@/lib/companii-data";

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getCategoryExtended(slug);

  if (!data) {
    notFound();
  }

  const { category, sources, features, faq } = data;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${category.color}1a` }}
          >
            {category.icon}
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              {category.name}
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              {category.shortDesc}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {category.fullDesc}
        </p>
      </section>

      {/* Data Sources */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          📋 Date disponibile
        </h2>
        <div className="space-y-2">
          {sources.map((src, i) => (
            <div
              key={i}
              className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-text-primary">
                  {src.institution}
                </span>
                <span className="shrink-0 rounded-full bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
                  {src.count} seturi
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">{src.description}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
                <span>
                  Format:{" "}
                  <strong className="text-text-secondary">
                    {src.format.join(", ")}
                  </strong>
                </span>
                <span>
                  Frecvență:{" "}
                  <strong className="text-text-secondary">
                    {src.frequency}
                  </strong>
                </span>
                <span>
                  Ani:{" "}
                  <strong className="text-text-secondary">{src.years}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          🚀 Funcționalități
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {features.map((feat, i) => (
            <div
              key={i}
              className="rounded-lg border border-border-subtle bg-bg-surface p-4"
            >
              <span className="text-xl">{feat.icon}</span>
              <h3 className="mt-2 text-sm font-medium text-text-primary">
                {feat.name}
              </h3>
              <p className="mt-1 text-xs text-text-muted">
                {feat.description}
              </p>
              {feat.href ? (
                <a
                  href={feat.href}
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent-primary/15 px-3 py-1 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
                >
                  Accesează →
                </a>
              ) : (
                <span className="mt-3 inline-block rounded-full bg-status-warning/15 px-2 py-0.5 text-xs text-status-warning">
                  în curând
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          ❓ Întrebări frecvente
        </h2>
        <div className="space-y-2">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border-subtle bg-bg-surface [&::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-text-secondary transition-colors hover:text-text-primary">
                {item.q}
                <span className="text-xs text-text-muted transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="border-t border-border-subtle px-4 py-3 text-sm text-text-muted">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
