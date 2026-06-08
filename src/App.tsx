import { lazy, Suspense, useState } from "react";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Stats } from "./components/Stats";
import { Recommendations } from "./components/Recommendations";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Portfolio } from "./components/Portfolio";
import { Blog } from "./components/Blog";
import { Footer } from "./components/Footer";
import { Dock } from "./components/Dock";
import { Toast } from "./components/Toast";
import { useVisitorCounter } from "./hooks/useVisitorCounter";
import { useKonamiCode } from "./hooks/useKonamiCode";

// Below-the-fold sections pulling heavy libs (Chart.js, Swiper) are code-split
// so they don't bloat the initial bundle.
const Certifications = lazy(() =>
  import("./components/Certifications").then((m) => ({ default: m.Certifications }))
);
const Photography = lazy(() =>
  import("./components/Photography").then((m) => ({ default: m.Photography }))
);

export default function App() {
  const stats = useVisitorCounter();
  const [konamiCount, setKonamiCount] = useState(0);

  useKonamiCode(() => setKonamiCount((c) => c + 1));

  return (
    <>
      <main>
        <Hero rainbow={konamiCount > 0} />
        <About />
        <Stats stats={stats} />
        <Recommendations />
        <Experience />
        <Skills />
        <Suspense fallback={null}>
          <Certifications />
        </Suspense>
        <Portfolio />
        <Blog />
        <Suspense fallback={null}>
          <Photography />
        </Suspense>
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
