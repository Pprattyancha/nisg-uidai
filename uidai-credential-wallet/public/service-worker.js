
const CACHE_VERSION = "uidai-wallet-v1";
const APP_CACHE = `${CACHE_VERSION}-app`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

const APP_SHELL = "/index.html";
const API_PATH = "/api/credentials";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);

      try {
        const response = await fetch(APP_SHELL, {
          cache: "reload",
        });

        if (response.ok) {
          await cache.put(APP_SHELL, response);
        }
      } catch (error) {
        console.warn("Unable to cache app shell:", error);
      }

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith("uidai-wallet-") &&
              ![APP_CACHE, ASSET_CACHE, DATA_CACHE].includes(name)
          )
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle same-origin GET requests only.
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Never cache authentication requests.
  if (url.pathname.includes("/auth/")) {
    return;
  }

  // Credential API: network first, cached response as fallback.
  if (url.pathname === API_PATH) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DATA_CACHE);

        try {
          const response = await fetch(request);

          if (response.ok) {
            const contentType =
              response.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
              try {
                await cache.put(request, response.clone());
              } catch (cacheError) {
                console.warn(
                  "Unable to cache credential response:",
                  cacheError
                );
              }
            }

            return response;
          }

          // Use previously cached data if the server returns an error.
          const cachedResponse = await cache.match(request);

          return cachedResponse || response;
        } catch (networkError) {
          // Network failed: try the cached API response.
          const cachedResponse = await cache.match(request);

          if (cachedResponse) {
            return cachedResponse;
          }

          return new Response(
            JSON.stringify({
              message:
                "Credential data is unavailable. Connect to the internet and retry.",
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      })()
    );

    return;
  }

  // Do not interfere with other API endpoints.
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Navigation: network first, cached app shell as offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(APP_CACHE);

            await cache.put(APP_SHELL, response.clone());
          }

          return response;
        } catch (error) {
          const cachedPage = await caches.match(APP_SHELL);

          if (cachedPage) {
            return cachedPage;
          }

          return new Response(
            "You are offline. Please reconnect and try again.",
            {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
              },
            }
          );
        }
      })()
    );

    return;
  }

  // Cache-first for static assets.
  const isStaticAsset =
    /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2?|ttf|otf)$/i.test(
      url.pathname
    );

  if (!isStaticAsset) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(ASSET_CACHE);
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const response = await fetch(request);

        if (response.ok && response.type === "basic") {
          await cache.put(request, response.clone());
        }

        return response;
      } catch (error) {
        return new Response("Asset unavailable offline.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    })()
  );
});
