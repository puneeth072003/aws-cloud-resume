import Lenis from "lenis";

/**
 * Single Lenis instance for the whole page. Kept in a module so the dock (and
 * anything else that jumps between sections) can drive the same inertia
 * scroller instead of fighting it with native `scrollIntoView`.
 */
let instance: Lenis | null = null;

export function createSmoothScroll(): Lenis {
  instance?.destroy();
  instance = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.6,
    smoothWheel: true,
  });
  return instance;
}

export function destroySmoothScroll() {
  instance?.destroy();
  instance = null;
}

export function getSmoothScroll(): Lenis | null {
  return instance;
}

/** Scroll to a section, through Lenis when it is running. */
export function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (instance) instance.scrollTo(el as HTMLElement, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
