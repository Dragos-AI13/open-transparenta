import { companiiCategories, type CompaniiCategory } from "./companii-domains";

// ──────────────────────────────────────────────
// Extended data per sub-category
// ──────────────────────────────────────────────

export interface DataSource {
  institution: string;
  count: number;
  format: string[];
  frequency: string;
  years: string;
  description: string;
}

export interface FeaturePlaceholder {
  icon: string;
  name: string;
  description: string;
  href?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CategoryExtended {
  category: CompaniiCategory;
  sources: DataSource[];
  features: FeaturePlaceholder[];
  faq: FaqItem[];
}

const extendedData: Record<string, Omit<CategoryExtended, "category">> = {
  "registrul-comertului": {
    sources: [
      {
        institution: "ONRC — Registrul Comerțului",
        count: 76,
        format: ["CSV", "ZIP"],
        frequency: "Lunar",
        years: "2013-2026",
        description:
          "Dumps lunare cu toate firmele înregistrate: denumire, CUI, EUID, adresă, formă juridică, stare, cod CAEN, reprezentanți legali.",
      },
    ],
    features: [
      {
        icon: "🔍",
        name: "Căutare firmă",
        description: "Caută orice firmă după nume, CUI sau domeniu de activitate.",
        href: "/companii/cauta",
      },
      {
        icon: "📄",
        name: "Profil firmă",
        description: "Date complete: stare, adresă, formă juridică, cod CAEN.",
        href: "/companii/cauta",
      },
      {
        icon: "📋",
        name: "Nomenclatoare",
        description: "Clasificare CAEN, forme juridice, stări firmă.",
      },
    ],
    faq: [
      { q: "Câte firme sunt înregistrate în România?", a: "Aproximativ 1.5 milioane de firme active, cu variații lunare." },
      { q: "Cum găsesc o firmă după CUI?", a: "Introduci CUI-ul în bara de căutare și vezi toate datele publice ale firmei." },
      { q: "Ce înseamnă 'starea' unei firme?", a: "Starea indică dacă firma e activă, dizolvată, radiată, inactivă sau suspendată." },
      { q: "Ce este codul CAEN?", a: "Este codul care clasifică domeniul de activitate al firmei (ex: 6201 - Activități de realizare a software-ului)." },
    ],
  },

  "situatii-financiare": {
    sources: [
      {
        institution: "Ministerul Finanțelor",
        count: 2,
        format: ["TXT", "CSV"],
        frequency: "Anual",
        years: "2024-2025",
        description:
          "Situații financiare anuale pentru TOATE firmele din România: cifră de afaceri, profit net/pierdere, active imobilizate și circulante, datorii, capitaluri proprii, număr mediu de salariați.",
      },
    ],
    features: [
      {
        icon: "📊",
        name: "Vizualizare date financiare",
        description: "Vezi bilanțul și contul de profit și pierdere pentru orice firmă, direct pe profil.",
        href: "/companii/cauta",
      },
      {
        icon: "📈",
        name: "Grafice evoluție",
        description: "Evoluția cifrei de afaceri, profitului, activelor și datoriilor pe ani.",
        href: "/companii/cauta",
      },
      {
        icon: "📥",
        name: "Export date (în curând)",
        description: "Descarcă situațiile financiare în CSV sau Excel.",
      },
    ],
    faq: [
      { q: "Ce informații financiare sunt disponibile?", a: "Cifra de afaceri, profit net/pierdere netă, active imobilizate, active circulante, stocuri, creanțe, numerar, datorii, capitaluri proprii și număr mediu de salariați." },
      { q: "Din ce ani sunt datele?", a: "Date disponibile pentru 2024 și 2025, actualizate anual de Ministerul Finanțelor." },
      { q: "Toate firmele au date financiare?", a: "Nu, doar firmele care au depus situații financiare la Ministerul Finanțelor apar în bază. Firmele nou-înființate sau radiate pot să nu aibă date." },
      { q: "Pot vedea datele financiare pe profilul firmei?", a: "Da, caută o firmă și accesează profilul — secțiunea Situații Financiare arată tabelul și graficele." },
    ],
  },

  "intreprinderi-publice": {
    sources: [
      {
        institution: "AMEPIP",
        count: 2,
        format: ["XLSX", "CSV"],
        frequency: "Anual",
        years: "curent",
        description:
          "Indicatori financiari, nefinanciari și de guvernanță corporativă pentru întreprinderile publice monitorizate.",
      },
    ],
    features: [
      {
        icon: "🏛️",
        name: "Listă întreprinderi",
        description: "Toate întreprinderile publice cu date de contact și domeniu.",
      },
      {
        icon: "📊",
        name: "Indicatori financiari",
        description: "Cifră de afaceri, profit, active, datorii per întreprindere.",
      },
    ],
    faq: [
      { q: "Ce este o întreprindere publică?", a: "O companie deținută integral sau majoritar de statul român sau de o unitate administrativ-teritorială." },
      { q: "Câte întreprinderi publice sunt monitorizate?", a: "Lista completă este publicată de AMEPIP și actualizată periodic." },
    ],
  },

  "piata-de-capital": {
    sources: [
      {
        institution: "ASF — Autoritatea de Supraveghere Financiară",
        count: 2,
        format: ["XLSX", "PDF", "CSV"],
        frequency: "Trimestrial",
        years: "curent",
        description: "Rapoarte privind piața de capital: emitenți, valori mobiliare, tranzacții.",
      },
      {
        institution: "BVB — Bursa de Valori București",
        count: 1,
        format: ["API", "CSV"],
        frequency: "Zilnic",
        years: "curent",
        description: "Cotații bursiere, indici BET, dividende, rapoarte emitenți.",
      },
    ],
    features: [
      {
        icon: "📈",
        name: "Cotații live",
        description: "Prețuri și evoluții pentru acțiunile listate la BVB.",
      },
      {
        icon: "🏢",
        name: "Emitenți",
        description: "Profilul fiecărei companii listate la bursă.",
      },
      {
        icon: "💵",
        name: "Dividende",
        description: "Istoric dividende și randament per acțiune.",
      },
    ],
    faq: [
      { q: "Ce indici bursieri sunt disponibili?", a: "Principalii indici BET, BET-TR, BET-XT, BET-NG, precum și indici sectoriali." },
      { q: "Cum pot vedea prețul istoric al unei acțiuni?", a: "Selectează emitentul și perioada dorită pentru graficul evoluției." },
    ],
  },

  "pensii-private": {
    sources: [
      {
        institution: "ASF — Autoritatea de Supraveghere Financiară",
        count: 1,
        format: ["XLSX", "PDF"],
        frequency: "Trimestrial",
        years: "curent",
        description:
          "Statistici privind fondurile de pensii private: active administrate, contribuții, randamente, participanți, pe fiecare fond.",
      },
    ],
    features: [
      {
        icon: "💰",
        name: "Comparare fonduri",
        description: "Compară activele, randamentele și numărul de participanți între fonduri.",
      },
      {
        icon: "📈",
        name: "Evoluție randamente",
        description: "Grafic cu randamentul istoric al fiecărui fond de pensii.",
      },
    ],
    faq: [
      { q: "Care e diferența între Pilon II și Pilon III?", a: "Pilon II este obligatoriu, administrat de fonduri private. Pilon III este facultativ și suplimentar." },
      { q: "Câți participanți sunt la pensiile private?", a: "Datele actualizate sunt publicate trimestrial de ASF." },
    ],
  },

  asigurari: {
    sources: [
      {
        institution: "ASF — Autoritatea de Supraveghere Financiară",
        count: 1,
        format: ["XLSX", "PDF"],
        frequency: "Trimestrial",
        years: "curent",
        description:
          "Date despre piața asigurărilor: prime subscrise, daune plătite, intermediari autorizați, solvabilitate asigurători.",
      },
    ],
    features: [
      {
        icon: "🛡️",
        name: "Top asigurători",
        description: "Clasamentul asigurătorilor după prime subscrise și cota de piață.",
      },
      {
        icon: "📊",
        name: "Statistici piață",
        description: "Evoluția pieței de asigurări pe segmente (RCA, CASCO, viață, etc.).",
      },
    ],
    faq: [
      { q: "Ce tipuri de asigurări sunt monitorizate?", a: "Asigurări generale (RCA, CASCO, proprietăți) și asigurări de viață." },
      { q: "Câți asigurători activi sunt în România?", a: "Lista completă cu solvabilitatea fiecăruia este publicată de ASF." },
    ],
  },

  "protectia-consumatorului": {
    sources: [
      {
        institution: "ANPC — Protecția Consumatorului",
        count: 3,
        format: ["XLSX", "PDF", "HTML"],
        frequency: "Lunar",
        years: "curent",
        description:
          "Amenzi, sancțiuni, controale OPC și reclamații înregistrate de ANPC.",
      },
    ],
    features: [
      {
        icon: "⚖️",
        name: "Amenzi recente",
        description: "Lista amenziilor aplicate de ANPC, cu numele firmei și valoarea.",
      },
      {
        icon: "🔍",
        name: "Caută firmă în amenzi",
        description: "Verifică dacă o firmă a fost sancționată de ANPC.",
      },
    ],
    faq: [
      { q: "Cum pot reclama un produs sau serviciu?", a: "Poți depune o reclamație la ANPC online sau la sediile teritoriale OPC." },
      { q: "Ce amenzi aplică ANPC?", a: "Amendele pot ajunge până la 4% din cifra de afaceri a firmei pentru abateri grave." },
    ],
  },

  concurenta: {
    sources: [
      {
        institution: "Consiliul Concurenței",
        count: 1,
        format: ["PDF", "HTML"],
        frequency: "Săptămânal",
        years: "curent",
        description:
          "Decizii, avize, concentrări economice și ajutoare de stat analizate de Consiliul Concurenței.",
      },
    ],
    features: [
      {
        icon: "🔒",
        name: "Decizii recente",
        description: "Ultimele decizii și avize emise de Consiliul Concurenței.",
      },
      {
        icon: "🔍",
        name: "Caută în decizii",
        description: "Caută decizii după nume firmă, sector sau an.",
      },
    ],
    faq: [
      { q: "Ce este o concentrare economică?", a: "Este o fuziune, achiziție sau preluare de control care poate afecta concurența pe piață." },
      { q: "Cât timp durează o analiză a Consiliului Concurenței?", a: "Termenul legal este de 30 de zile pentru notificări simple, prelungibil în cazuri complexe." },
    ],
  },

  "drepturi-de-autor": {
    sources: [
      {
        institution: "ORDA — Oficiul Român pentru Drepturile de Autor",
        count: 8,
        format: ["XLSX", "PDF", "CSV"],
        frequency: "Lunar",
        years: "curent",
        description:
          "Statistici privind marcajele holografice distribuite, produse pirat distruse și top societăți beneficiare.",
      },
    ],
    features: [
      {
        icon: "💎",
        name: "Marcaje holografice",
        description: "Statistici privind distribuția marcajelor pe suporți și luni.",
      },
      {
        icon: "📊",
        name: "Top beneficiari",
        description: "Topul societăților care au achiziționat cele mai multe marcaje.",
      },
    ],
    faq: [
      { q: "Ce sunt marcajele holografice ORDA?", a: "Sunt timbrele aplicate pe suporturile fonograme și videograme pentru a atesta legalitatea copiei." },
      { q: "Când se actualizează datele?", a: "ORDA publică rapoarte lunare și trimestriale." },
    ],
  },
};

export function getCategoryExtended(slug: string): CategoryExtended | null {
  const category = companiiCategories.find((c) => c.slug === slug);
  if (!category) return null;

  const extra = extendedData[slug];
  if (!extra) return null;

  return { category, ...extra };
}

export function getAllCategorySlugs(): string[] {
  return companiiCategories.map((c) => c.slug);
}
