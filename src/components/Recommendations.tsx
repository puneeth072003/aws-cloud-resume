import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { RECOMMENDATIONS } from "../data/resume";

export function Recommendations() {
  const { t } = useTranslation();

  return (
    <section id="recommendations" className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading
          titleKey="recommendations.title"
          descriptionKey="recommendations.description"
        />

        <div className="mt-16 grid md:grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center items-stretch">
          {RECOMMENDATIONS.map((rec, index) => (
            <Reveal
              key={rec.nameKey}
              delay={index * 0.1}
              className="recommendation-card glass-pane rounded-xl p-6"
            >
              <div className="recommendation-content">
                <div className="flex items-start gap-4 mb-4">
                  <div className="recommendation-avatar">
                    <i className="fas fa-user-circle text-4xl text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-orbitron text-lg text-white">
                      {t(rec.nameKey)}
                    </h3>
                    <p className="text-sky-300 text-sm font-semibold">
                      {t(rec.positionKey)}
                    </p>
                  </div>
                  <div className="recommendation-quote-icon">
                    <i className="fas fa-quote-right text-2xl text-sky-400/30" />
                  </div>
                </div>
                <blockquote className="text-slate-300 italic leading-relaxed">
                  {t(rec.quoteKey)}
                </blockquote>
                <div className="mt-auto pt-4 flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className="fas fa-star" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm ml-2">
                    {t("recommendations.rating")}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
