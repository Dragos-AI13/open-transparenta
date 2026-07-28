import type { Metadata } from "next";
import { DomainLayout } from "@/components/companii/DomainLayout";

export const metadata: Metadata = {
  title: "Companii și Comerț — Open Transparență",
  description:
    "Toate datele publice despre firmele din România: Registrul Comerțului, situații financiare, piață de capital, pensii private, asigurări, protecția consumatorului, concurență și drepturi de autor.",
  keywords: [
    "companii",
    "ONRC",
    "firme România",
    "registrul comerțului",
    "situații financiare",
    "CUI",
  ],
};

export default function CompaniiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DomainLayout>{children}</DomainLayout>;
}
