import IntreprinderiPubliceTable from "@/components/companii/IntreprinderiPubliceTable";
import { getCategoryExtended } from "@/lib/companii-data";

// Pagină dedicată — are prioritate peste /companii/[slug] în Next.js.
export default async function IntreprinderiPublicePage() {
  const data = getCategoryExtended("intreprinderi-publice");
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
            {category?.icon ?? "🏛️"}
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              {category?.name ?? "Întreprinderi Publice"}
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              {category?.shortDesc ?? "Companiile deținute de stat"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {category?.fullDesc ??
            "Întreprinderile publice monitorizate de AMEPIP — firme cu capital de stat, cu indicatori financiari specifici (ROE, EBITDA, lichiditate). Sursă: AMEPIP (OUG 109/2011), data.gov.ro."}
        </p>
      </section>

      {/* Live table */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          📊 Lista întreprinderilor publice
        </h2>
        <IntreprinderiPubliceTable />
      </section>
    </div>
  );
}
