/// <reference lib="webworker" />
import {
  Serwist,
  CacheFirst,
  NetworkFirst,
  ExpirationPlugin,
  CacheableResponsePlugin,
} from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: Array<{ url: string; revision: string | null }>;
};

const serwist = new Serwist({
  // Precache-ul staticilor build-ului (generat automat de Serwist)
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  runtimeCaching: [
    {
      // API-uri: NetworkFirst (date proaspete online, cache la offline)
      // NICIODATĂ CacheFirst pe API — risc date vechi
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "api-cache",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 3600 }), // 1h
        ],
      }),
    },
    {
      // Statice (iconițe, fonturi, imagini): CacheFirst
      matcher: ({ request }) =>
        request.destination === "image" ||
        request.destination === "font" ||
        request.destination === "style" ||
        request.destination === "script",
      handler: new CacheFirst({
        cacheName: "static-assets",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 86400 }), // 30 zile
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
