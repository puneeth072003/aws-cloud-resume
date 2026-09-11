import { useEffect } from "react";
import {
  createSmoothScroll,
  destroySmoothScroll,
  getSmoothScroll,
} from "../lib/smoothScroll";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Runs the page-wide inertia scroller. Disabled outright for reduced-motion
 * users, and parked while the intro is still loading so the page cannot be
 * scrolled out from under the hero.
 */
export function useSmoothScroll(enabled: boolean) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = createSmoothScroll();
    document.documentElement.classList.add("lenis-active");

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("lenis-active");
      destroySmoothScroll();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const lenis = getSmoothScroll();
    if (!lenis) return;
    if (enabled) lenis.start();
    else {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
    }
  }, [enabled]);
}
