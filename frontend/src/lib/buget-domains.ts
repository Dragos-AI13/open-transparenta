export interface BugetSubdomain {
  slug: string;
  name: string;
  icon: string;
  shortDesc: string;
  status: "live" | "planned";
  href?: string;
  /** Subdomeniu fără sursă de date viabilă (verificat) — ascuns din UI, dar păstrat în cod pentru reversibilitate */
  hidden?: boolean;
}

/** Subdomeniile domeniului „Buget și Finanțe" (din docs/04-domains/01-buget-si-finante) */
export const bugetSubdomains: BugetSubdomain[] = [
  {
    slug: "curs-valutar",
    name: "Curs Valutar",
    icon: "💱",
    shortDesc: "Cursul BNR zilnic — 37 valute de referință",
    status: "live",
    href: "/buget-si-finante/curs-valutar",
  },
  {
    slug: "bugetul-de-stat",
    name: "Bugetul de Stat",
    icon: "📋",
    shortDesc: "Legea bugetară anuală, execuții lunare, rectificări",
    status: "live",
    href: "/buget-si-finante/bugetul-de-stat",
  },
  {
    slug: "bugete-locale",
    name: "Bugete Locale",
    icon: "🏘️",
    shortDesc: "Consilii județene, primării, instituții subordonate",
    status: "planned",
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): data.gov.ro doar fișiere vechi 2018, fragmentate, majoritatea doar link-uri
  },
  {
    slug: "datoria-publica",
    name: "Datoria Publică",
    icon: "📈",
    shortDesc: "Datorie guvernamentală, titluri de stat, garanții",
    status: "planned",
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): MF blocat (connection reset), data.gov.ro doar local (Vrancea), Eurostat = doar UE agregat
  },
  {
    slug: "taxe-si-impozite",
    name: "Taxe și Impozite",
    icon: "💳",
    shortDesc: "Buletin statistic fiscal ANAF, datorii la buget, arierate",
    status: "live",
    href: "/buget-si-finante/taxe-si-impozite",
  },
  {
    slug: "investitii-si-fonduri",
    name: "Investiții și Fonduri",
    icon: "🏗️",
    shortDesc: "PNRR, fonduri europene, CNI, proiecte contractate",
    status: "planned",
  },
  {
    slug: "finantare-partide",
    name: "Finanțare Partide",
    icon: "🗳️",
    shortDesc: "AEP — venituri, cheltuieli și subvenții ale partidelor",
    status: "planned",
    hidden: true, // ❌ fără sursă viabilă (verificat 2026-08-01): aep.ro = parking page, finantarepartide.ro + roaep.ro = reCAPTCHA (anti-bot total)
  },
];
