import type { Metadata, Viewport } from "next";
import "@fontsource/inter";
import "@fontsource/jetbrains-mono";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Open Transparență — Caută orice dată publică din România",
  description:
    "Motor de căutare pentru toate datele publice din România. Instant. Gratuit. Open-source.",
  keywords: [
    "date publice",
    "România",
    "transparență",
    "open data",
    "data.gov.ro",
    "ONRC",
    "BNR",
  ],
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="h-full antialiased">
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
