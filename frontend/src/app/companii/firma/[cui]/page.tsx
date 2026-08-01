import { Meilisearch } from "meilisearch";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { CompanyDoc } from "@/lib/meilisearch";
import { getFinancialData } from "@/lib/financiar";
import FinancialTable from "@/components/companii/FinancialTable";
import FinancialCharts from "@/components/companii/FinancialCharts";
import RepresentativesCard from "@/components/companii/RepresentativesCard";
import IntreprinderePublicaCard from "@/components/companii/IntreprinderePublicaCard";

// ── Meilisearch client ─────────────────────────

function getClient() {
  return new Meilisearch({
    host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
    apiKey: process.env.MEILISEARCH_API_KEY || "",
  });
}

// ── Helpers ────────────────────────────────────

function normalizeStare(stare: string): string {
  return stare
    .replace(/\?/g, "")
    .replace(/\u015F/g, "\u0219")
    .replace(/\u0163/g, "\u021B")
    .replace(/\u015E/g, "\u0218")
    .replace(/\u0162/g, "\u021A");
}

const STARE_STYLES: Record<string, string> = {
  Funcțiune: "bg-green-500/10 text-green-400 border-green-500/20 ring-1 ring-green-500/20",
  Radiată: "bg-red-500/10 text-red-400 border-red-500/20 ring-1 ring-red-500/20",
  Dizolvare: "bg-orange-500/10 text-orange-400 border-orange-500/20 ring-1 ring-orange-500/20",
  Faliment: "bg-red-600/10 text-red-500 border-red-600/20 ring-1 ring-red-600/20",
  Lichidare: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 ring-1 ring-yellow-500/20",
};

function getStareStyle(stare: string): string {
  const n = normalizeStare(stare);
  for (const [key, style] of Object.entries(STARE_STYLES)) {
    if (normalizeStare(key) === n) return style;
  }
  return "bg-blue-500/10 text-blue-400 border-blue-500/20 ring-1 ring-blue-500/20";
}

function formatStare(stare: string): string {
  const n = normalizeStare(stare);
  if (!n || n === "Funcțiune") return "🟢 Activă";
  return n;
}

const CAEN_SECTIONS: Record<string, string> = {
  A: "Agricultură", B: "Industrie extractivă", C: "Industrie prelucrătoare",
  D: "Energie electrică și termică", E: "Apă și salubritate", F: "Construcții",
  G: "Comerț cu ridicata și amănuntul", H: "Transport și depozitare",
  I: "Hoteluri și restaurante", J: "Informații și comunicații",
  K: "Intermedieri financiare", L: "Tranzacții imobiliare",
  M: "Activități profesionale, științifice și tehnice",
  N: "Activități de servicii administrative", O: "Administrație publică",
  P: "Învățământ", Q: "Sănătate și asistență socială",
  R: "Cultură, divertisment și recreere", S: "Alte activități de servicii",
  T: "Activități ale gospodăriilor private", U: "Activități ale organizațiilor extrateritoriale",
};

// ── Info card component ────────────────────────

function InfoCard({ label, value, className }: { label: string; value: string | undefined | null; className?: string }) {
  return (
    <div className={`rounded-lg border border-border-subtle bg-bg-surface p-4 ${className || ""}`}>
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</p>
      <p className="mt-1.5 text-sm text-text-primary font-medium break-words">
        {value || <span className="text-text-muted italic">—</span>}
      </p>
    </div>
  );
}

// ── Page ────────────────────────────────────────

export default async function CompanyProfile({
  params,
}: {
  params: Promise<{ cui: string }>;
}) {
  const { cui } = await params;
  const normalizedCui = cui.trim().toUpperCase();

  if (!normalizedCui || normalizedCui.length < 3) {
    notFound();
  }

  // Fetch company from Meilisearch
  const client = getClient();
  let company: CompanyDoc | null = null;

  try {
    const result = await client.index("companies").search(normalizedCui, {
      filter: [`cui = "${normalizedCui}"`],
      limit: 1,
    });
    company = (result.hits?.[0] as CompanyDoc) ?? null;
  } catch {
    // fall through to 404
  }

  if (!company) {
    notFound();
  }

  // Fetch financial data
  let financialData: Awaited<ReturnType<typeof getFinancialData>> | null = null;
  try {
    financialData = await getFinancialData(normalizedCui);
  } catch {
    // Non-critical, just show placeholder
  }

  const hasFinancialData = financialData && financialData.hits.length > 0;

  const {
    denumire,
    cui: cuiVal,
    numar_registru_comert,
    forma_juridica,
    stare,
    adresa,
    localitate,
    judet,
    cod_caen,
    cod_caen_denumire,
    caen_sectiune,
    data_infiintare,
    telefon,
    email,
    website,
  } = company;

  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-text-muted">
        <Link href="/companii" className="transition-colors hover:text-text-primary">
          Companii și Comerț
        </Link>
        <span className="select-none">›</span>
        <Link href="/companii/cauta" className="transition-colors hover:text-text-primary">
          Căutare
        </Link>
        <span className="select-none">›</span>
        <span className="font-medium text-text-secondary">{denumire}</span>
      </nav>

      {/* Înapoi */}
      <Link
        href="/companii/cauta"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent-secondary transition-colors hover:text-accent-primary"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Înapoi la căutare
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {denumire}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            <span className="font-mono">{cuiVal}</span>
            {numar_registru_comert && (
              <>
                <span className="mx-1.5 text-border-subtle">·</span>
                {numar_registru_comert}
              </>
            )}
          </p>
        </div>
        {stare && (
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium ${getStareStyle(stare)}`}>
            {formatStare(stare)}
          </span>
        )}
      </div>

      {/* Info Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <InfoCard label="Formă juridică" value={forma_juridica} />
        <InfoCard label="Județ" value={judet} />
        <InfoCard label="Localitate" value={localitate} />
        <InfoCard label="Dată înființare" value={data_infiintare} />
        {caen_sectiune && (
          <InfoCard
            label="Secțiune CAEN"
            value={`${caen_sectiune} — ${CAEN_SECTIONS[caen_sectiune] || caen_sectiune}`}
          />
        )}
        {cod_caen && (
          <InfoCard label="Cod CAEN" value={cod_caen} />
        )}
        {cod_caen_denumire && (
          <InfoCard label="Activitate principală" value={cod_caen_denumire} />
        )}
        <InfoCard label="Telefon" value={telefon} />
        <InfoCard label="Email" value={email} />
        {website && <InfoCard label="Website" value={website} />}
      </div>

      {/* Adresă completă */}
      {adresa && (
        <div className="mt-6 rounded-lg border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Adresă</p>
          <p className="mt-1.5 text-sm text-text-primary">{adresa}</p>
          {(localitate || judet) && (
            <p className="mt-0.5 text-sm text-text-secondary">
              {[localitate, judet].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Financial Data */}
      <div className="mt-8">
        {hasFinancialData ? (
          <>
            <FinancialTable data={financialData!.hits} />
            <FinancialCharts data={financialData!.hits} />
          </>
        ) : (
          <div className="rounded-xl border border-border-subtle border-dashed bg-bg-surface/50 p-6 text-center">
            <div className="text-2xl">📊</div>
            <h3 className="mt-2 text-sm font-semibold text-text-primary">
              Situații Financiare
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Date financiare indisponibile pentru această firmă
            </p>
          </div>
        )}
      </div>

      {/* Intreprindere publica card (doar daca firma e in lista AMEPIP) */}
      <div className="mt-4">
        <IntreprinderePublicaCard cui={normalizedCui} />
      </div>

      {/* Administratori si actionari */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RepresentativesCard cui={normalizedCui} />
      </div>
    </div>
  );
}
