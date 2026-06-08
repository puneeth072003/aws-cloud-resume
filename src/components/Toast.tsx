import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AVATAR } from "../data/resume";
import { useCountUp } from "../hooks/useCountUp";

interface ToastProps {
  /** Set once the visitor count has loaded — triggers the greeting toast. */
  visitorNumber: number | null;
  ready: boolean;
  /** Increments each time the Konami code is entered. */
  konamiCount: number;
}

type Variant = "greeting" | "konami";

const AUTO_HIDE_MS = 6500;

export function Toast({ visitorNumber, ready, konamiCount }: ToastProps) {
  const { t, i18n } = useTranslation();
  const [variant, setVariant] = useState<Variant | null>(null);

  // Greeting toast once the counter resolves.
  useEffect(() => {
    if (!ready) return;
    setVariant("greeting");
    const id = setTimeout(() => setVariant(null), AUTO_HIDE_MS);
    return () => clearTimeout(id);
  }, [ready]);

  // Konami easter-egg toast.
  useEffect(() => {
    if (konamiCount === 0) return;
    setVariant("konami");
    const id = setTimeout(() => setVariant(null), AUTO_HIDE_MS);
    return () => clearTimeout(id);
  }, [konamiCount]);

  const isKonami = variant === "konami";
  const visible = variant !== null;
  const animatedCount = useCountUp(
    visible && !isKonami ? visitorNumber : null
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast-card"
          data-variant={variant}
          initial={{ x: "120%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "120%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <div className="toast-card__inner">
            <div className="toast-card__avatar">
              <img src={AVATAR} alt="Avatar" />
              <span className="toast-card__status" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-orbitron text-white text-base leading-tight">
                {isKonami ? "🌈 Konami Unlocked" : t("toast.welcome")}
              </h3>
              <p className="text-slate-300 text-sm mt-0.5">
                {isKonami
                  ? "Secret found — enjoy the rainbow."
                  : t("toast.thanks")}
              </p>
              {!isKonami && visitorNumber !== null && (
                <p className="toast-card__visitor mt-2">
                  <span>{t("toast.visitor")}</span>
                  <span className="toast-card__count">
                    {animatedCount.toLocaleString(i18n.language)}
                  </span>
                </p>
              )}
            </div>

            <button
              className="toast-card__close"
              aria-label="Close"
              onClick={() => setVariant(null)}
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
