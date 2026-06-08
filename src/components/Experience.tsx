import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { EXPERIENCE } from "../data/resume";

export function Experience() {
  const { t } = useTranslation();

  return (
    <section id="experience" className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading
          titleKey="experience.title"
          descriptionKey="experience.description"
        />

        <div className="mt-16 relative">
          <div className="timeline-line" />
          <div className="relative z-10">
            {EXPERIENCE.map((job, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              return (
                <Reveal
                  key={job.companyKey}
                  direction={side === "left" ? "left" : "right"}
                  className={`timeline-item ${side}`}
                >
                  <div className="glass-pane p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-orbitron text-xl text-white">
                        {t(job.companyKey)}
                      </h3>
                      <span className="text-sky-400 text-sm font-semibold whitespace-nowrap ml-3">
                        {t(job.periodKey)}
                      </span>
                    </div>
                    <h4 className="text-sky-300 font-semibold mb-3">
                      {t(job.positionKey)}
                    </h4>
                    <p className="text-slate-400 mb-4">{t(job.descriptionKey)}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-800 text-sky-300 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
