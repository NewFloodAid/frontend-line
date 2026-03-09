declare global {
  interface Window {
    L?: any;
    __leafletLoadingPromise?: Promise<any>;
  }
}

const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

function ensureLeafletCss(): void {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(
    `link[data-leaflet-css="true"]`,
  ) as HTMLLinkElement | null;
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS_URL;
  link.setAttribute("data-leaflet-css", "true");
  document.head.appendChild(link);
}

export async function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("Leaflet can only be loaded in the browser.");
  }

  if (window.L) {
    return window.L;
  }

  ensureLeafletCss();

  if (!window.__leafletLoadingPromise) {
    window.__leafletLoadingPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[data-leaflet-js="true"]`,
      ) as HTMLScriptElement | null;

      if (existing) {
        existing.addEventListener("load", () => resolve(window.L), {
          once: true,
        });
        existing.addEventListener(
          "error",
          () => reject(new Error("Failed to load Leaflet script.")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = LEAFLET_JS_URL;
      script.async = true;
      script.setAttribute("data-leaflet-js", "true");
      script.onload = () => resolve(window.L);
      script.onerror = () =>
        reject(new Error("Failed to load Leaflet script."));
      document.body.appendChild(script);
    });
  }

  return window.__leafletLoadingPromise;
}

export {};
