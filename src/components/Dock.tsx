import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { NAV_ITEMS } from "../data/resume";
import { useTheme } from "../hooks/useTheme";

const BASE_SIZE = 50;
const MAX_SIZE = 92;
const INFLUENCE = 150; // px of cursor distance over which an icon reacts

interface DockEntry {
  key: string;
  title?: string;
  content: ReactNode;
  onClick: () => void;
}

/**
 * A single magnifying dock icon — the canonical macOS-style approach.
 *
 * Distance from the cursor maps to a target width; a single light spring drives
 * that width, and height + icon size are derived from the *same* spring value
 * (via useTransform, not separate springs) so they stay perfectly in sync. This
 * is what makes the growth feel buttery instead of stepped/jittery.
 */
function MagneticItem({
  entry,
  mouseX,
}: {
  entry: DockEntry;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return INFLUENCE + 1;
    return val - (bounds.left + bounds.width / 2);
  });

  const widthSync = useTransform(
    distance,
    [-INFLUENCE, 0, INFLUENCE],
    [BASE_SIZE, MAX_SIZE, BASE_SIZE]
  );
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const fontSize = useTransform(width, (w) => w * 0.4);

  return (
    <motion.button
      ref={ref}
      className="dock-item"
      style={{ width, height: width, fontSize }}
      title={entry.title}
      onClick={entry.onClick}
    >
      {entry.content}
    </motion.button>
  );
}

export function Dock() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mouseX = useMotionValue(Infinity);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith("de") ? "en" : "de");
  };

  const lang = i18n.language.startsWith("de") ? "DE" : "EN";

  const navEntries: DockEntry[] = NAV_ITEMS.map((item) => ({
    key: item.href,
    title: t(item.labelKey),
    content: <i className={`fas ${item.icon}`} />,
    onClick: () => scrollTo(item.href),
  }));

  const toggleEntries: DockEntry[] = [
    {
      key: "theme",
      title: theme === "light" ? "Dark mode" : "Light mode",
      content: <i className={`fas ${theme === "light" ? "fa-sun" : "fa-moon"}`} />,
      onClick: toggleTheme,
    },
    {
      key: "lang",
      title: "Language",
      content: <span className="lang-text">{lang}</span>,
      onClick: toggleLanguage,
    },
  ];

  const allEntries = [...navEntries, ...toggleEntries];

  return (
    <nav id="bottom-nav">
      {/* Mobile expanding menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-dock-menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {allEntries.map((entry) => (
              <button
                key={entry.key}
                className="dock-item"
                title={entry.title}
                onClick={entry.onClick}
              >
                {entry.content}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <motion.div
        id="mobile-dock-toggle"
        className="dock-item"
        onClick={() => setMobileOpen((o) => !o)}
        animate={{ rotate: mobileOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <i className="fas fa-plus" />
      </motion.div>

      {/* Desktop magnetic dock */}
      <div
        id="bottom-dock"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {navEntries.map((entry) => (
          <MagneticItem key={entry.key} entry={entry} mouseX={mouseX} />
        ))}
        <div className="dock-separator" />
        {toggleEntries.map((entry) => (
          <MagneticItem key={entry.key} entry={entry} mouseX={mouseX} />
        ))}
      </div>
    </nav>
  );
}
