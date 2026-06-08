import { useEffect, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Fires `onUnlock` when the Konami code is entered. */
export function useKonamiCode(onUnlock: () => void) {
  const positionRef = useRef(0);
  const callbackRef = useRef(onUnlock);
  callbackRef.current = onUnlock;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const expected = KONAMI_CODE[positionRef.current];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        positionRef.current += 1;
        if (positionRef.current === KONAMI_CODE.length) {
          positionRef.current = 0;
          callbackRef.current();
        }
      } else {
        positionRef.current = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
