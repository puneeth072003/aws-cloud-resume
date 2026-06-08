import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AVATAR } from "../data/resume";

interface ToastProps {
  /** Set once the visitor count has loaded — triggers the greeting toast. */
  visitorNumber: number | null;
  ready: boolean;
  /** Increments each time the Konami code is entered. */
  konamiCount: number;
}

type Variant = "greeting" | "konami";

const AUTO_HIDE_MS = 6000;

export function Toast({ visitorNumber, ready, konamiCount }: ToastProps) {
  const { t } = useTranslation();
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

  return (
    <AnimatePresence>
      {variant && (
        <motion.div
          className="fixed top-8 right-8 z-[1100] bg-black/80 backdrop-blur-md border border-sky-500/30 rounded-xl p-4 shadow-lg flex items-center max-w-md"
          initial={{ x: "120%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "120%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mr-4 flex-shrink-0">
            <img
              src={AVATAR}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-sky-400"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-orbitron text-white text-lg">
              {isKonami ? "🌈 Konami Code Activated!" : t("toast.welcome")}
            </h3>
            <p className="text-slate-300 text-sm">
              {isKonami
                ? "You found a secret! Enjoy the rainbow effect."
                : t("toast.thanks")}
            </p>
            {!isKonami && visitorNumber !== null && (
              <p id="visitor-toast-number" className="text-sky-400 font-semibold mt-1">
                <span>{t("toast.visitor")}</span>
                <span>{visitorNumber.toLocaleString()}</span>
              </p>
            )}
          </div>
          <button
            className="ml-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
            onClick={() => setVariant(null)}
          >
            <i className="fas fa-times" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
