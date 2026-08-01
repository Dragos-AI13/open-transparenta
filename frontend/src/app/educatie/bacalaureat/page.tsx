import BacalaureatTable from "@/components/educatie/BacalaureatTable";

export const metadata = {
  title: "Bacalaureat — Open Transparență",
  description:
    "Ratele de promovare la examenul de bacalaureat pe școli și județe — din rezultatele publicate de Ministerul Educației.",
};

export default function BacalaureatPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
            📝
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Bacalaureat
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Ratele de promovare pe școli și județe
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Cât de bine promovează elevii bacalaureatul, școală cu școală:
          candidați, prezenți, promovați și rata de promovare, agregat pe
          unități de învățământ. Datele provin din rezultatele la examenul
          de bacalaureat publicate de Ministerul Educației. Candidații sunt
          anonimizați în setul original — afișăm doar statistici pe școli.
        </p>
      </section>

      {/* Live table */}
      <section>
        <BacalaureatTable />
      </section>
    </div>
  );
}
