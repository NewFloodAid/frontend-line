const DEFAULT_PIN_COLOR = "#ef4444";

function normalizeHexColor(color: string): string {
  const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(
    color ?? "",
  );
  return isValidHex ? color : DEFAULT_PIN_COLOR;
}

export function createPinSvgDataUrl(color: string): string {
  const pinColor = normalizeHexColor(color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="54" viewBox="0 0 40 54"><path fill="${pinColor}" stroke="#ffffff" stroke-width="2" d="M20 0C8.954 0 0 8.954 0 20c0 14.779 17.25 31.942 19.21 33.835a1.12 1.12 0 0 0 1.58 0C22.75 51.942 40 34.779 40 20 40 8.954 31.046 0 20 0z"/><circle cx="20" cy="20" r="7" fill="#fff"/><ellipse cx="20" cy="50" rx="8" ry="3" fill="#000" opacity="0.18"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createLeafletPinIcon(L: any, color: string) {
  return L.icon({
    iconUrl: createPinSvgDataUrl(color),
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  });
}
