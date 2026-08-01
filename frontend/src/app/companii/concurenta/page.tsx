import DeciziiConcurentaTable from "@/components/companii/DeciziiConcurentaTable";
import { getCategoryExtended } from "@/lib/companii-data";

// Pagină dedicată — are prioritate peste /companii/[slug] în Next.js.
export default async function ConcurentaPage() {
  const data = getCategoryExtended("concurenta");
  const category = data?.category;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{
              backgroundColor: category ? `${category.color}1a` : undefined,
            }}
          >
            {category?.icon ?? "🔒"}
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              {category?.name ?? "Concurență"}
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              {category?.shortDesc ?? "Decizii și concentrări economice"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {category?.fullDesc ??
            "Decizii, avize și concentrări economice analizate de Consiliul Concurenței. Ajutoare de stat și practici anticoncurențiale. Sursă: consiliulconcurentei.ro."}
        </p>
      </section>

      {/* Live table */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          📜 Decizii publicate
        </h2>
        <DeciziiConcurentaTable />
      </section>
    </div>
  );
}
