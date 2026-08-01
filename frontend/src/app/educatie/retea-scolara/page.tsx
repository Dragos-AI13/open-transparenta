import ReteaScolaraTable from "@/components/educatie/ReteaScolaraTable";

export const metadata = {
  title: "Rețea Școlară — Open Transparență",
  description:
    "Toate unitățile de învățământ din România: denumire, județ, localitate, mediu, tip și contact — din rețeaua școlară a Ministerului Educației.",
};

export default function ReteaScolaraPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
            🏫
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Rețea Școlară
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Toate unitățile de învățământ din România
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Caută orice școală, grădiniță sau liceu din România: denumire,
          județ, localitate, mediu (urban/rural) și date de contact. Datele
          provin din rețeaua școlară publicată de Ministerul Educației
          pentru anul școlar 2025-2026.
        </p>
      </section>

      {/* Live table */}
      <section>
        <ReteaScolaraTable />
      </section>
    </div>
  );
}
