"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

const JUDETE = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași",
  "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
  "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
  "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj",
  "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea",
  "Vrancea",
];

const FORME_JURIDICE = ["SRL", "SA", "PFA", "II", "IF", "SCS", "SCA", "RA", "OB"];

const STARE_OPTIONS = [
  "Funcțiune",
  "Radiată",
  "Dizolvare",
  "Faliment",
  "Lichidare",
  "Inactivată",
  "Suspendată",
];

const CAEN_SECTIUNI: Record<string, string> = {
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

const SORT_OPTIONS = [
  { value: "", label: "Relevanță" },
  { value: "denumire:asc", label: "Denumire A-Z" },
  { value: "denumire:desc", label: "Denumire Z-A" },
  { value: "data_infiintare:desc", label: "Cele mai noi" },
  { value: "data_infiintare:asc", label: "Cele mai vechi" },
];

interface Props {
  facetDistribution?: Record<string, Record<string, number>> | null;
}

export default function SearchFilters({ facetDistribution }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => ({
    q: searchParams.get("q") || "",
    judet: searchParams.get("judet") || "",
    localitate: searchParams.get("localitate") || "",
    forma_juridica: searchParams.getAll("forma_juridica"),
    stare: searchParams.getAll("stare"),
    caen_sectiune: searchParams.get("caen_sectiune") || "",
    website: searchParams.get("website") || "",
    sort: searchParams.get("sort") || "",
  }), [searchParams]);

  const updateFilter = useCallback(
    (key: string, value: string | string[], replaceExisting = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (key === "q" && !value) {
        params.delete("q");
      } else if (key === "forma_juridica" || key === "stare") {
        // Multi-value: delete all then re-add
        params.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => v && params.append(key, v));
        }
      } else if (key === "page") {
        params.set(key, String(value));
      } else if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }

      // Reset page when filters change (unless page itself changed)
      if (key !== "page") {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Get facet-driven counts for judet
  const judetCounts = facetDistribution?.judet || {};

  return (
    <aside className="w-72 shrink-0 space-y-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
        Filtre
      </h2>

      {/* ── Județ ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Județ
        </label>
        <select
          value={currentFilters.judet}
          onChange={(e) => updateFilter("judet", e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="">Toate județele</option>
          {JUDETE.map((j) => (
            <option key={j} value={j}>
              {j} {judetCounts[j] ? `(${judetCounts[j].toLocaleString()})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* ── Localitate ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Localitate
        </label>
        <input
          type="text"
          placeholder="De exemplu: Cluj-Napoca"
          value={currentFilters.localitate}
          onChange={(e) => updateFilter("localitate", e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      {/* ── Formă juridică ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Formă juridică
        </label>
        <div className="space-y-1.5">
          {FORME_JURIDICE.map((fj) => (
            <label
              key={fj}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm text-text-secondary hover:bg-bg-elevated"
            >
              <input
                type="checkbox"
                checked={currentFilters.forma_juridica.includes(fj)}
                onChange={(e) => {
                  const current = [...currentFilters.forma_juridica];
                  if (e.target.checked) {
                    current.push(fj);
                  } else {
                    const idx = current.indexOf(fj);
                    if (idx >= 0) current.splice(idx, 1);
                  }
                  updateFilter("forma_juridica", current);
                }}
                className="h-4 w-4 rounded border-border-subtle bg-bg-surface text-accent-primary focus:ring-accent-primary"
              />
              {fj}
            </label>
          ))}
        </div>
      </div>

      {/* ── Stare ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Stare firmă
        </label>
        <div className="space-y-1.5">
          {STARE_OPTIONS.map((s) => (
            <label
              key={s}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm text-text-secondary hover:bg-bg-elevated"
            >
              <input
                type="checkbox"
                checked={currentFilters.stare.includes(s)}
                onChange={(e) => {
                  const current = [...currentFilters.stare];
                  if (e.target.checked) {
                    current.push(s);
                  } else {
                    const idx = current.indexOf(s);
                    if (idx >= 0) current.splice(idx, 1);
                  }
                  updateFilter("stare", current);
                }}
                className="h-4 w-4 rounded border-border-subtle bg-bg-surface text-accent-primary focus:ring-accent-primary"
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      {/* ── CAEN Secțiune ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Secțiune CAEN
        </label>
        <select
          value={currentFilters.caen_sectiune}
          onChange={(e) => updateFilter("caen_sectiune", e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="">Toate secțiunile</option>
          {Object.entries(CAEN_SECTIUNI).map(([k, v]) => (
            <option key={k} value={k}>
              {k} — {v}
            </option>
          ))}
        </select>
      </div>

      {/* ── Are website ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Website
        </label>
        <select
          value={currentFilters.website}
          onChange={(e) => updateFilter("website", e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="">Oricare</option>
          <option value="yes">Are website</option>
          <option value="no">Fără website</option>
        </select>
      </div>

      {/* ── Sort ── */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Ordonează
        </label>
        <select
          value={currentFilters.sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Reset ── */}
      <button
        onClick={() => router.push(pathname)}
        className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-secondary transition-all hover:border-border-default hover:text-text-primary"
      >
        Resetează filtrele
      </button>
    </aside>
  );
}
