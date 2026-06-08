import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
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
const MAX_SIZE = 86;
const INFLUENCE = 140;

interface DockEntry {
  key: string;
  title?: string;
  content: ReactNode;
  onClick: () => void;
}

/**
 * A single desktop dock icon that magnifies based on cursor proximity.
 *
 * Distance is measured from the item's *resting* center (captured once at rest
 * and on resize) rather than its live bounding box. Measuring the live box is
 * what made the old version jitter: scaling an item shifts its rect, which
 * changes the distance, which changes the scale — a feedback loop. With a fixed
 * resting center the spring has a stable target and the growth is smooth.
 */
function MagneticItem({
  entry,
  mouseX,
  index,
  centers,
}: {
  entry: DockEntry;
  mouseX: MotionValue<number>;
  index: number;
  centers: RefObject<number[]>;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    if (val === Infinity) return INFLUENCE + 1;
    const center = centers.current?.[index];
    if (center == null) return INFLUENCE + 1;
    return val - center;
  });

  const sizeTarget = useTransform(
    distance,
    [-INFLUENCE, 0, INFLUENCE],
    [BASE_SIZE, MAX_SIZE, BASE_SIZE],
    { clamp: true }
  );
  const liftTarget = useTransform(
    distance,
    [-INFLUENCE, 0, INFLUENCE],
    [0, -10, 0],
    { clamp: true }
  );

  const spring = { stiffness: 320, damping: 26, mass: 0.6 };
  const size = useSpring(sizeTarget, spring);
  const y = useSpring(liftTarget, spring);
  // Keep the icon proportional to the circle as it grows (20px at 50px = 0.4).
  const fontSize = useTransform(size, (s) => s * 0.4);

  return (
    <motion.button
      ref={ref}
      className="dock-item"
      style={{ width: size, height: size, y, fontSize }}
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
  const dockRef = useRef<HTMLDivElement>(null);
  const centers = useRef<number[]>([]);

  // Capture each icon's resting center X (and keep it fresh across resizes).
  useLayoutEffect(() => {
    const measure = () => {
      const items = dockRef.current?.querySelectorAll<HTMLElement>(".dock-item");
      if (!items) return;
      centers.current = Array.from(items).map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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

  const desktopEntries = [...navEntries, ...toggleEntries];

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
            {desktopEntries.map((entry) => (
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
        ref={dockRef}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {navEntries.map((entry, i) => (
          <MagneticItem
            key={entry.key}
            entry={entry}
            mouseX={mouseX}
            index={i}
            centers={centers}
          />
        ))}
        <div className="dock-separator" />
        {toggleEntries.map((entry, i) => (
          <MagneticItem
            key={entry.key}
            entry={entry}
            mouseX={mouseX}
            index={navEntries.length + i}
            centers={centers}
          />
        ))}
      </div>
    </nav>
  );
}
