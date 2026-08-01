import TaxeImpoziteTable from "@/components/buget/TaxeImpoziteTable";

export const metadata = {
  title: "Taxe și Impozite — Open Transparență",
  description:
    "Veniturile fiscale ale României: TVA, impozit pe profit, accize — din Buletinul Statistic Fiscal ANAF, comparativ pe trimestre.",
};

export default function TaxeSiImpozitePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
            💳
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Taxe și Impozite
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Veniturile fiscale ale statului — din Buletinul Statistic Fiscal ANAF
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Cât încasează statul din fiecare taxă și impozit: TVA, impozit pe
          profit, impozit pe venit, accize. Datele provin din Buletinul
          Statistic Fiscal publicat trimestrial de ANAF și includ numărul de
          contribuabili activi pe categorii de plătitori.
        </p>
      </section>

      {/* Live table */}
      <section>
        <TaxeImpoziteTable />
      </section>
    </div>
  );
}
