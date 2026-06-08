import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { PROJECTS } from "../data/resume";

export function Portfolio() {
  const { t } = useTranslation();

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-black/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading
          titleKey="portfolio.title"
          descriptionKey="portfolio.description"
        />

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <Reveal
              key={project.titleKey}
              delay={(index % 2) * 0.1}
              className="project-card glass-pane rounded-xl block overflow-hidden"
            >
              <div className="video-container">
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-48 object-cover"
                />
                <div className="video-title">{t(project.titleKey)}</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sky-400 text-3xl">
                    <i className={`fas ${project.icon}`} />
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Live Site"
                      className="text-2xl text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      <i className="far fa-eye" />
                    </a>
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Source Code"
                      className="text-2xl text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      <i className="fab fa-github" />
                    </a>
                  </div>
                </div>
                <p className="text-slate-400 mt-2">{t(project.descriptionKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
