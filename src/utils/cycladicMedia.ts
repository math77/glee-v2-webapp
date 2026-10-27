const CYCLADIC_ASSET_ROOT = "/images/cycladic";

export const CYCLADIC_GALLERY_COUNT = 100;
export const CYCLADIC_DECAY_TOKENS = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95] as const;
const CYCLADIC_TERMINAL_CAPTURE_PCT = 75;

function padded(value: number) {
  return String(value).padStart(3, "0");
}

export function cycladicImagePath(tokenId: number, decayPct = 0) {
  // The final Cycladic package captures exact decay through 75%; that capture is
  // already the collection's white terminal state, so reuse it for the UI's 100% label.
  const capturedDecayPct = decayPct === 100 ? CYCLADIC_TERMINAL_CAPTURE_PCT : decayPct;
  return `${CYCLADIC_ASSET_ROOT}/GLEE-${padded(tokenId)}-decay-${padded(capturedDecayPct)}.png`;
}

export const cycladicGalleryImages = Array.from(
  { length: CYCLADIC_GALLERY_COUNT },
  (_, index) => cycladicImagePath(index + 1),
);
