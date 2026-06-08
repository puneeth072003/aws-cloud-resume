import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ErrorBoundary } from "./ErrorBoundary";

// Three.js is heavy; defer it so the hero text paints before the sphere streams in.
const ParticleField = lazy(() =>
  import("./ParticleField").then((m) => ({ default: m.ParticleField }))
);

export function Hero({ rainbow = false }: { rainbow?: boolean }) {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="relative z-10 p-4">
        <motion.h1
          className={`font-orbitron text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-wider ${
            rainbow ? "rainbow-text" : "text-white"
          }`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("hero.name")}
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-2xl text-sky-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("hero.subtitle")}
        </motion.p>
      </div>
    </section>
  );
}
