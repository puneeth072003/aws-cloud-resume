import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuroraBackground } from "./components/AuroraBackground";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HeroScene } from "./components/HeroScene";
import { Preloader } from "./components/Preloader";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Stats } from "./components/Stats";
import { Recommendations } from "./components/Recommendations";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Portfolio } from "./components/Portfolio";
import { BuiltWithCard } from "./components/BuiltWithCard";
import { Footer } from "./components/Footer";
import { Dock } from "./components/Dock";
import { Toast } from "./components/Toast";
import { useVisitorCounter } from "./hooks/useVisitorCounter";
import { useKonamiCode } from "./hooks/useKonamiCode";
import { useIntroProgress } from "./hooks/useIntroProgress";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useTheme } from "./hooks/useTheme";

// Photography is below the fold; code-split it from the initial bundle.
const Photography = lazy(() =>
  import("./components/Photography").then((m) => ({ default: m.Photography }))
);

export default function App() {
  const stats = useVisitorCounter();
  const [konamiCount, setKonamiCount] = useState(0);
  const [glUnsupported, setGlUnsupported] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { progress, ready } = useIntroProgress();
  useSmoothScroll(ready);

  useKonamiCode(() => setKonamiCount((c) => c + 1));

  // Park the page at the top while the cluster is still assembling.
  useEffect(() => {
    document.body.classList.toggle("is-intro", !ready);
    return () => document.body.classList.remove("is-intro");
  }, [ready]);

  return (
    <>
      <AuroraBackground />

      <ErrorBoundary fallback={null}>
        <HeroScene
          progress={progress}
          revealed={ready}
          title={t("hero.name")}
          theme={theme}
          rainbow={konamiCount > 0}
          onUnsupported={() => setGlUnsupported(true)}
        />
      </ErrorBoundary>

      <main>
        <Hero ready={ready} rainbow={konamiCount > 0} showName={glUnsupported} />
        <About />
        <Stats stats={stats} />
        <Recommendations />
        <Experience />
        <Skills />
        <Portfolio />
        <Suspense fallback={null}>
          <Photography />
        </Suspense>
        <BuiltWithCard />
        <Footer />
      </main>

      <Dock />
      {ready && (
        <Toast
          visitorNumber={stats.views}
          ready={stats.ready}
          konamiCount={konamiCount}
        />
      )}

      <Preloader progress={progress} done={ready} />
    </>
  );
}
