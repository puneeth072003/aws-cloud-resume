import { lazy, Suspense, useState } from "react";
import { AuroraBackground } from "./components/AuroraBackground";
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

// Photography is below the fold; code-split it from the initial bundle.
const Photography = lazy(() =>
  import("./components/Photography").then((m) => ({ default: m.Photography }))
);

export default function App() {
  const stats = useVisitorCounter();
  const [konamiCount, setKonamiCount] = useState(0);

  useKonamiCode(() => setKonamiCount((c) => c + 1));

  return (
    <>
      <AuroraBackground />

      <main>
        <Hero rainbow={konamiCount > 0} />
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
      <Toast
        visitorNumber={stats.views}
        ready={stats.ready}
        konamiCount={konamiCount}
      />
    </>
  );
}
