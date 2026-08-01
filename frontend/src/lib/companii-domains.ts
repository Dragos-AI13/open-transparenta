export interface CompaniiCategory {
  slug: string;
  name: string;
  color: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  sourceCount: number;
  keyInstitutions: string[];
  /** Apar în sidebar doar categoriile cu date reale sau sursă confirmată */
  showInSidebar: boolean;
  /** Categorie fără sursă de date viabilă (verificat) — ascunsă din UI, dar păstrată în cod pentru reversibilitate */
  hidden?: boolean;
}

export const companiiCategories: CompaniiCategory[] = [
  {
    slug: "registrul-comertului",
    name: "Registrul Comerțului",
    color: "#f97316",
    icon: "🏢",
    shortDesc: "Toate firmele din România",
    fullDesc:
      "Datele Oficiului Național al Registrului Comerțului: firme înregistrate, nomenclatoare CAEN, forme juridice, activități autorizate. Actualizat lunar prin dumps CSV.",
    sourceCount: 76,
    keyInstitutions: ["ONRC — Registrul Comerțului"],
    showInSidebar: true,
  },
  {
    slug: "situatii-financiare",
    name: "Situații Financiare",
    color: "#10b981",
    icon: "📊",
    shortDesc: "Bilanțuri și performanță financiară",
    fullDesc:
      "Situațiile financiare anuale ale companiilor: cifră de afaceri, profit, active, datorii, număr angajați. Date istorice 2008-2025, actualizate anual.",
    sourceCount: 2,
    keyInstitutions: ["Ministerul Finanțelor"],
    showInSidebar: true,
  },
  {
    slug: "intreprinderi-publice",
    name: "Întreprinderi Publice",
    color: "#3b82f6",
    icon: "🏛️",
    shortDesc: "Companiile deținute de stat",
    fullDesc:
      "Indicatori financiari, nefinanciari și de guvernanță pentru întreprinderile publice monitorizate de AMEPIP. Lista completă și date comparative.",
    sourceCount: 2,
    keyInstitutions: ["AMEPIP"],
    showInSidebar: true,
  },
  {
    slug: "piata-de-capital",
    name: "Piață de Capital",
    color: "#8b5cf6",
    icon: "📈",
    shortDesc: "Bursă, acțiuni și emitenți",
    fullDesc:
      "Date de la BVB și ASF: cotații bursiere, indici, emitenți, dividende, valori mobiliare. Pentru investitori și analiști.",
    sourceCount: 3,
    keyInstitutions: ["ASF", "BVB — Bursa de Valori București"],
    showInSidebar: false,
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): data.gov.ro 0 seturi; ASF blochează botii, BVB fără API JSON
  },
  {
    slug: "pensii-private",
    name: "Pensii Private",
    color: "#ec4899",
    icon: "💰",
    shortDesc: "Fonduri de pensii Pilon II și III",
    fullDesc:
      "Statistici privind fondurile de pensii private: active administrate, contribuții, randamente, număr de participanți, pe fiecare fond în parte.",
    sourceCount: 1,
    keyInstitutions: ["ASF — Autoritatea de Supraveghere Financiară"],
    showInSidebar: false,
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): data.gov.ro doar bugete MF irelevante (2014-2018)
  },
  {
    slug: "asigurari",
    name: "Asigurări",
    color: "#06b6d4",
    icon: "🛡️",
    shortDesc: "Piața de asigurări din România",
    fullDesc:
      "Date despre piața asigurărilor: prime subscrise, daune plătite, intermediari autorizați, solvabilitate. Actualizat periodic de ASF.",
    sourceCount: 1,
    keyInstitutions: ["ASF — Autoritatea de Supraveghere Financiară"],
    showInSidebar: false,
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): data.gov.ro 0 seturi; ASF „Request Rejected" anti-bot
  },
  {
    slug: "protectia-consumatorului",
    name: "Protecția Consumatorului",
    color: "#ef4444",
    icon: "⚖️",
    shortDesc: "Amenzi, controale și reclamații OPC",
    fullDesc:
      "Activitatea Autorității Naționale pentru Protecția Consumatorului: amenzi și sancțiuni, controale OPC, reclamații și sesizări.",
    sourceCount: 3,
    keyInstitutions: ["ANPC — Protecția Consumatorului"],
    showInSidebar: false,
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): data.gov.ro 0 seturi relevante
  },
  {
    slug: "concurenta",
    name: "Concurență",
    color: "#f59e0b",
    icon: "🔒",
    shortDesc: "Decizii și concentrări economice",
    fullDesc:
      "Decizii, avize și concentrări economice analizate de Consiliul Concurenței. Ajutoare de stat și practici anticoncurențiale.",
    sourceCount: 1,
    keyInstitutions: ["Consiliul Concurenței"],
    showInSidebar: true,
  },
  {
    slug: "drepturi-de-autor",
    name: "Drepturi de Autor",
    color: "#84cc16",
    icon: "💎",
    shortDesc: "Marcaje holografice și topuri ORDA",
    fullDesc:
      "Statistici privind marcajele holografice distribuite de ORDA, produse pirat distruse, top societăți beneficiare.",
    sourceCount: 8,
    keyInstitutions: ["ORDA — Oficiul Român pentru Drepturile de Autor"],
    showInSidebar: false,
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): ORDA 7 seturi dar toate din 2018 (vechi de 8 ani)
  },
];
