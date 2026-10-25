// Where a hero picture is anchored inside the hero, as a CSS object-position.
// The owner can choose it two ways in Studio (Home Page → Hero slideshow):
//  1. the simple drop-downs "Show which part…" — used first when chosen
//  2. the picture's Hotspot tool — used when the drop-downs are left on Automatic
// With neither, the top of the picture is kept (the original hero behaviour).

export type VerticalFocus = "top" | "upper" | "middle" | "lower" | "bottom";
export type HorizontalFocus = "left" | "center" | "right";

const VERTICAL: Record<VerticalFocus, string> = {
  top: "0%",
  upper: "25%",
  middle: "50%",
  lower: "75%",
  bottom: "100%",
};

const HORIZONTAL: Record<HorizontalFocus, string> = {
  left: "0%",
  center: "50%",
  right: "100%",
};

const pct = (n: number) => `${Math.round(Math.min(1, Math.max(0, n)) * 100)}%`;

export function heroObjectPosition(
  hotspot: { x?: number; y?: number } | null | undefined,
  vertical?: string | null,
  horizontal?: string | null,
): string {
  const x =
    (horizontal && HORIZONTAL[horizontal as HorizontalFocus]) ||
    (typeof hotspot?.x === "number" ? pct(hotspot.x) : "70%");
  const y =
    (vertical && VERTICAL[vertical as VerticalFocus]) ||
    (typeof hotspot?.y === "number" ? pct(hotspot.y) : "0%");
  return `${x} ${y}`;
}
