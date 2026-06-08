import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { PIPELINE_STAGES, RESUME_PDF } from "../data/resume";

export function Skills() {
  const { t } = useTranslation();

  return (
    <section
      id="pipeline"
      className="feature-section py-16 md:py-24 bg-black/20 overflow-hidden"
    >
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <Reveal className="feature-content" direction="left">
          <h2 className="font-orbitron text-3xl md:text-4xl text-white">
            {t("skills.title")}
          </h2>
          <p className="mt-4 text-md md:text-lg text-slate-400 whitespace-pre-line">
            {t("skills.description")}
          </p>
        </Reveal>

        <div className="flex flex-col items-center justify-center gap-8">
          <Reveal
            direction="right"
            className="glass-pane h-[200px] md:h-[300px] w-full flex items-center justify-center"
          >
            <div className="pipeline-visual w-full">
              {PIPELINE_STAGES.map((stage, index) => (
                <Fragment key={stage.labelKey}>
                  <div className="pipeline-stage">
                    <i className={`fas ${stage.icon}`} />
                    <p className="mt-2 text-xs md:text-sm font-semibold">
                      {t(stage.labelKey)}
                    </p>
                  </div>
                  {index < PIPELINE_STAGES.length - 1 && (
                    <div className="pipeline-connector" />
                  )}
                </Fragment>
              ))}
            </div>
          </Reveal>

          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            className="font-orbitron mt-5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-lg px-6 py-2 rounded-lg transition-colors"
          >
            {t("skills.viewCV")}
          </a>
        </div>
      </div>
    </section>
  );
}
