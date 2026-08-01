import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";

// Revisie pentru precache-ul paginilor (evită răspunsuri vechi)
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ??
  crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: "/", revision }],
    swSrc: "src/app/sw.ts",
    // Folosim esbuild nativ (Windows) pentru bundling-ul SW
    useNativeEsbuild: true,
  });
