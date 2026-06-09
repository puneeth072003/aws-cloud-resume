import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { RESUME_PDF } from "../data/resume";

// Chart.js is heavy; load the radar only when this section is reached.
const SkillsRadar = lazy(() =>
  import("./SkillsRadar").then((m) => ({ default: m.SkillsRadar }))
);

export function Skills() {
  const { t } = useTranslation();

  return (
    <section
      id="skills"
      className="feature-section py-16 md:py-24 bg-black/20 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <Reveal className="feature-content" direction="left">
            <h2 className="font-orbitron text-3xl md:text-4xl text-white">
              {t("skills.title")}
            </h2>
            <p className="mt-4 text-md md:text-lg text-slate-400 whitespace-pre-line">
              {t("skills.description")}
            </p>
            <a
              href={RESUME_PDF}
              target="_blank"
              rel="noreferrer"
              className="font-orbitron inline-block mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-lg px-6 py-2 rounded-lg transition-colors"
            >
              {t("skills.viewCV")}
            </a>
          </Reveal>

          <Reveal direction="right" className="h-80 md:h-96 w-full relative">
            <Suspense fallback={null}>
              <SkillsRadar />
            </Suspense>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
