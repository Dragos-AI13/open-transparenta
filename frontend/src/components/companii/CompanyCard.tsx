import type { CompanyDoc } from "@/lib/meilisearch";
import Link from "next/link";

// Normalize Romanian diacritics: handle both cedilla (U+015F/U+0163) and
// comma (U+0219/U+021B) variants, plus corrupted '?' encoding
function normalizeStare(stare: string): string {
  return stare
    .replace(/\?/g, "")
    .replace(/\u015F/g, "\u0219") // ş → ș
    .replace(/\u0163/g, "\u021B") // ţ → ț
    .replace(/\u015E/g, "\u0218") // Ş → Ș
    .replace(/\u0162/g, "\u021A"); // Ţ → Ț
}

const STARE_COLORS: Record<string, string> = {
  "": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Funcțiune": "bg-green-500/10 text-green-400 border-green-500/20",
  "Radiată": "bg-red-500/10 text-red-400 border-red-500/20",
  "Dizolvare": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Faliment": "bg-red-600/10 text-red-500 border-red-600/20",
  "Lichidare": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Inactivată": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  "Suspendată": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

function getStareColor(stare: string): string {
  const normalized = normalizeStare(stare);
  // Match against known keys (try normalized first)
  for (const [key, color] of Object.entries(STARE_COLORS)) {
    if (normalizeStare(key) === normalized) return color;
  }
  return STARE_COLORS[""] || "bg-blue-500/10 text-blue-400 border-blue-500/20";
}

function formatStare(stare: string): string {
  const normalized = normalizeStare(stare);
  if (!normalized || normalized === "Funcțiune") return "🟢 Activă";
  return normalized;
}

const CAEN_SECTIONS: Record<string, string> = {
  A: "Agricultură",
  B: "Industrie extractivă",
  C: "Industrie prelucrătoare",
  D: "Energie electrică și termică",
  E: "Apă și salubritate",
  F: "Construcții",
  G: "Comerț cu ridicata și amănuntul",
  H: "Transport și depozitare",
  I: "Hoteluri și restaurante",
  J: "Informații și comunicații",
  K: "Intermedieri financiare",
  L: "Tranzacții imobiliare",
  M: "Activități profesionale, științifice și tehnice",
  N: "Activități de servicii administrative",
  O: "Administrație publică",
  P: "Învățământ",
  Q: "Sănătate și asistență socială",
  R: "Cultură, divertisment și recreere",
  S: "Alte activități de servicii",
  T: "Activități ale gospodăriilor private",
  U: "Activități ale organizațiilor extrateritoriale",
};

interface Props {
  company: CompanyDoc;
}

export default function CompanyCard({ company }: Props) {
  const {
    denumire,
    cui,
    judet,
    localitate,
    forma_juridica,
    stare,
    cod_caen,
    cod_caen_denumire,
    caen_sectiune,
    data_infiintare,
    website,
  } = company;

  return (
    <Link
      href={`/companii/firma/${cui}`}
      className="group block rounded-xl border border-border-subtle bg-bg-surface p-4 transition-all hover:border-border-default hover:shadow-search"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: company info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-text-primary group-hover:text-accent-primary">
            {denumire}
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            <span className="font-mono text-xs">{cui}</span>
            {judet && (
              <>
                <span className="mx-1.5 text-border-subtle">·</span>
                {judet}
              </>
            )}
            {forma_juridica && (
              <>
                <span className="mx-1.5 text-border-subtle">·</span>
                {forma_juridica}
              </>
            )}
          </p>

          {/* CAEN */}
          {cod_caen_denumire && (
            <p className="mt-1.5 text-xs text-text-muted">
              {cod_caen && (
                <span className="font-mono text-accent-secondary">
                  {cod_caen.split(", ").slice(0, 2).join(", ")}
                  {cod_caen.split(", ").length > 2 && "..."}
                </span>
              )}
              {cod_caen && cod_caen_denumire && <span className="mx-1">—</span>}
              {cod_caen_denumire}
            </p>
          )}

          {/* CAEN section badge */}
          {caen_sectiune && (
            <p className="mt-1 text-xs text-text-muted">
              Secțiunea {caen_sectiune}: {CAEN_SECTIONS[caen_sectiune] || caen_sectiune}
            </p>
          )}

          {/* Localitate + data infiintare */}
          <p className="mt-1 text-xs text-text-muted">
            {localitate && <span>{localitate}</span>}
            {data_infiintare && (
              <span className="ml-2">Înființată: {data_infiintare}</span>
            )}
          </p>
        </div>

        {/* Right: stare badge */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {stare && (
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStareColor(stare)}`}
            >
              {formatStare(stare)}
            </span>
          )}
          {website && (
            <span className="text-xs text-text-muted" title="Are website">
              🌐
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
