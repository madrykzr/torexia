import type Lenis from "lenis";

// The shared Lenis instance is stashed on `window` by SmoothScroll so other
// components can drive smooth scroll (native scroll is decoupled while Lenis
// runs). Accessed via an unknown cast to avoid clashing with global typings.
type LenisHost = { lenis?: Lenis };

export function getLenis(): Lenis | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as LenisHost).lenis;
}

export function setLenis(instance: Lenis | undefined): void {
  if (typeof window === "undefined") return;
  (window as unknown as LenisHost).lenis = instance;
}
