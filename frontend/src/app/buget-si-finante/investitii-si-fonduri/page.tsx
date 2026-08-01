import ProiecteFonduriTable from "@/components/buget/ProiecteFonduriTable";

export const metadata = {
  title: "Investiții și Fonduri — Open Transparență",
  description:
    "Proiectele finanțate din fonduri europene în România: proiecte contractate pe programe operaționale, beneficiari, județe și stadiul absorbției — din datele MFE.",
};

export default function InvestitiiSiFonduriPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
            🏗️
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Investiții și Fonduri
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Proiectele finanțate din fonduri europene — din datele MFE
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Ce proiecte europene sunt finanțate în România și cât s-a absorbit
          din fonduri: proiecte contractate pe 7 programe operaționale
          (POIM, POC, POCU, POR, POAT, POAD, POCA), cu beneficiari, județe și
          valori, plus stadiul absorbției pe programe. Datele provin din
          listele de proiecte contractate publicate de Ministerul
          Investițiilor și Proiectelor Europene.
        </p>
      </section>

      {/* Live table */}
      <section>
        <ProiecteFonduriTable />
      </section>
    </div>
  );
}
