import { useEffect, useRef, useState } from "react";

/**
 * Animates an integer from 0 up to `target` over `duration` ms whenever
 * `target` changes (and is non-null). Returns the current value to render.
 */
export function useCountUp(target: number | null, duration = 1200): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number>();

  useEffect(() => {
    if (target === null) return;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic for a snappy settle
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(from + (target - from) * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);

  return value;
}
