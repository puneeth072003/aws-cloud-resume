import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

/** Full-screen image viewer. Closes on backdrop click, the × button, or Escape. */
export function Lightbox({ src, onClose }: LightboxProps) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <button
            className="lightbox-close"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
          <motion.img
            src={src}
            alt="Full-size view"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            transition={{ duration: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
