import { useEffect, useState } from "react";

/** Shortest the intro is allowed to run, so the assembly reads as deliberate. */
const MIN_DURATION = 2200;
/** Progress ceiling while we are still waiting on fonts / window load. */
const HOLD_AT = 0.92;

/**
 * Drives the preloader counter and, with it, the hero cluster assembling.
 * Progress eases toward whichever is further along: elapsed time, or the real
 * readiness signals (fonts decoded + window load). It only reaches 1 once both
 * have landed and the minimum duration has passed.
 */
export function useIntroProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let settled = false;
    const start = performance.now();

    const signals = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true })
          ),
    ]).then(() => {
      settled = true;
    });
    void signals;

    let eased = 0;
    let frame = 0;
    let last = start;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const elapsed = (now - start) / MIN_DURATION;
      const target = settled ? Math.max(elapsed, HOLD_AT) : Math.min(elapsed, HOLD_AT);
      // Time-based easing: a slow device must not stretch the intro out.
      eased += (Math.min(target, 1) - eased) * (1 - Math.exp(-dt * 9));
      if (settled && elapsed >= 1 && eased > 0.99) eased = 1;
      setProgress(eased);
      if (eased < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return { progress, ready: progress >= 1 };
}
