import BugetStatTable from "@/components/buget/BugetStatTable";

export const metadata = {
  title: "Bugetul de Stat — Open Transparență",
  description:
    "Bugetul de stat al României: venituri, cheltuieli pe funcțiuni și deficit, pe ani (2023-2025). Sursă: Ministerul Finanțelor.",
};

export default function BugetulDeStatPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
            📋
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Bugetul de Stat
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Legea bugetară anuală — venituri, cheltuieli și deficit
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Cum arată banii publici ai României: ce încasează statul (impozite,
          taxe, contribuții), pe ce cheltuiește (funcțiuni: învățământ,
          sănătate, apărare, transporturi...) și cât este deficitul bugetar.
          Date din legea bugetară anuală (anexa 1 — sinteza), publicată de
          Ministerul Finanțelor.
        </p>
      </section>

      {/* Live table */}
      <section>
        <BugetStatTable />
      </section>
    </div>
  );
}
