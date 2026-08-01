export interface EducatieSubdomain {
  slug: string;
  name: string;
  icon: string;
  shortDesc: string;
  status: "live" | "planned";
  href?: string;
  /** Subdomeniu fără sursă de date viabilă (verificat) — ascuns din UI, dar păstrat în cod pentru reversibilitate */
  hidden?: boolean;
}

/**
 * Subdomeniile domeniului „Educație".
 * Surse verificate 2026-08-01 pe data.gov.ro (org: ministerul-educatiei).
 */
export const educatieSubdomains: EducatieSubdomain[] = [
  {
    slug: "retea-scolara",
    name: "Rețea Școlară",
    icon: "🏫",
    shortDesc: "Toate unitățile de învățământ — adresă, județ, mediu, tip",
    status: "planned",
  },
  {
    slug: "bacalaureat",
    name: "Bacalaureat",
    icon: "📝",
    shortDesc: "Rezultate la examenul de bacalaureat, pe sesiuni",
    status: "planned",
  },
  {
    slug: "cadre-didactice",
    name: "Cadre Didactice",
    icon: "👩‍🏫",
    shortDesc: "Numărul cadrelor didactice preuniversitare, per grad",
    status: "planned",
  },
  {
    slug: "studenti",
    name: "Studenți",
    icon: "🎓",
    shortDesc: "Studenți înmatriculați la studii universitare",
    status: "planned",
    hidden: true, // ❌ sursă veche (verificat 2026-08-01): „Numărul de studenți înmatriculați" e din 2022
  },
  {
    slug: "retea-universitara",
    name: "Rețea Universitară",
    icon: "🏛️",
    shortDesc: "Unitățile de învățământ universitar din România",
    status: "planned",
    hidden: true, // ❌ sursă veche (verificat 2026-08-01): „Rețeaua unităților de învățământ universitar" e 2020-2021
  },
];
