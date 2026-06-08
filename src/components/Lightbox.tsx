import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LightboxProps {
  photos: string[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

/**
 * Full-screen image viewer with prev/next navigation. Closes on backdrop click,
 * the × button, or Escape; arrow keys move between photos.
 */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const isOpen = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, go]);

  return (
    <AnimatePresence>
      {isOpen && (
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
          <button className="lightbox-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>

          <button
            className="lightbox-nav lightbox-nav--prev"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <i className="fas fa-chevron-left" />
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={photos[index]}
              alt={`Photo ${index + 1} of ${photos.length}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>

          <button
            className="lightbox-nav lightbox-nav--next"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <i className="fas fa-chevron-right" />
          </button>

          <div className="lightbox-counter">
            {index + 1} / {photos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
