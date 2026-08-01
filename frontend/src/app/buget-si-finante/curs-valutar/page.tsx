import CursValutarTable from "@/components/buget/CursValutarTable";

export const metadata = {
  title: "Curs Valutar BNR — Open Transparență",
  description:
    "Cursul de schimb valutar oficial BNR: euro, dolar, franc elvețian, liră sterlină și toate valutele de referință. Actualizat zilnic.",
};

export default function CursValutarPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
            💱
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Curs Valutar BNR
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Indicatori financiari — cursul oficial de schimb
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Cursul de referință publicat zilnic de Banca Națională a României
          pentru principalele valute: euro, dolar american, franc elvețian,
          liră sterlină și alte 30+ valute. Datele sunt preluate automat din
          API-ul public BNR și actualizate în fiecare zi lucrătoare.
        </p>
      </section>

      {/* Live table */}
      <section>
        <CursValutarTable />
      </section>
    </div>
  );
}
