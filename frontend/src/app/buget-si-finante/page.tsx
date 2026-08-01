import Link from "next/link";
import { bugetSubdomains } from "@/lib/buget-domains";

export const metadata = {
  title: "Buget și Finanțe — Open Transparență",
  description:
    "Banii publici ai României: curs valutar BNR, bugetul de stat, taxe și impozite, datorie publică, fonduri europene, finanțarea partidelor.",
};

export default function BugetFinantePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
            💰
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Buget și Finanțe
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Banii publici ai României — de unde vin, unde se duc
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Date despre banii publici: ce încasează statul (taxe, impozite,
          contribuții), ce cheltuiește (bugete, salarii, investiții), cât
          datorează (datorie publică) și cum se gospodăresc autoritățile
          locale. Include indicatorii financiari (curs valutar, inflație,
          dobânzi) și fondurile europene.
        </p>
      </section>

      {/* Subdomains grid */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Subdomenii
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bugetSubdomains.map((sub) => {
            const isLive = sub.status === "live" && sub.href;
            if (isLive) {
              return (
                <Link
                  key={sub.slug}
                  href={sub.href!}
                  className="group flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-bg-surface p-4 transition-all hover:border-amber-500/30 hover:bg-bg-elevated"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-lg">
                      {sub.icon}
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                      Live
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {sub.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-muted">
                      {sub.shortDesc}
                    </p>
                  </div>
                </Link>
              );
            }
            return (
              <div
                key={sub.slug}
                className="group flex cursor-default flex-col gap-2.5 rounded-xl border border-border-subtle/50 bg-bg-surface/50 p-4 opacity-70"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-lg">
                    {sub.icon}
                  </span>
                  <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                    În pregătire
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {sub.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    {sub.shortDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Instituții în acest domeniu
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "🏛️ Ministerul Finanțelor",
            "💳 ANAF",
            "🏛️ BNR — Banca Națională",
            "🏛️ AEP",
            "⚡ Ministerul Energiei",
            "🏗️ CNI",
            "🌐 MFE",
          ].map((inst) => (
            <span
              key={inst}
              className="rounded-full border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs text-text-secondary"
            >
              {inst}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
