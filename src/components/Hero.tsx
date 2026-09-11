import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { scrollToSection } from "../lib/smoothScroll";

/**
 * The hero's DOM half. The name itself is drawn in WebGL by <HeroScene /> so it
 * can be pushed through the fluid distortion, which leaves a visually hidden
 * <h1> here to carry the heading for screen readers and crawlers.
 */
export function Hero({
  ready,
  rainbow = false,
  showName = false,
}: {
  ready: boolean;
  rainbow?: boolean;
  /** True when the WebGL title could not start; the name falls back to DOM. */
  showName?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className={`relative h-screen w-full flex justify-center text-center ${
        showName ? "items-center" : "items-end"
      }`}
    >
      <div className={`relative z-10 w-full px-4 ${showName ? "" : "pb-[14vh]"}`}>
        <h1
          className={
            showName
              ? "font-orbitron text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-6"
              : "sr-only"
          }
        >
          {t("hero.name")}
        </h1>

        <motion.p
          className={`mx-auto max-w-2xl text-sm md:text-base uppercase tracking-[0.18em] leading-relaxed ${
            rainbow ? "rainbow-text" : "text-sky-300/90"
          }`}
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.button
          type="button"
          className="hero-scroll-cue font-orbitron"
          onClick={() => scrollToSection("#about")}
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {t("hero.scroll", "Scroll")}
          <span aria-hidden="true" className="hero-scroll-cue__line" />
        </motion.button>
      </div>
    </section>
  );
}
