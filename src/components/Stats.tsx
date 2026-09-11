import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { formatRelativeTime } from "../utils/relativeTime";
import type { VisitorStats } from "../hooks/useVisitorCounter";

export function Stats({ stats }: { stats: VisitorStats }) {
  const { t, i18n } = useTranslation();

  const viewsLabel =
    stats.views === null ? "0" : stats.views.toLocaleString(i18n.language);
  const lastVisit = formatRelativeTime(
    stats.updatedAt,
    i18n.language,
    t("stats.justNow")
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="glass-pane p-8 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Reveal>
            <p className="font-orbitron text-3xl md:text-4xl text-sky-300">1</p>
            <p className="text-slate-400 mt-2">{t("stats.experience")}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-orbitron text-3xl md:text-4xl text-sky-300">
              {viewsLabel}
            </p>
            <p className="text-slate-400 mt-2">{t("stats.visitors")}</p>
            <p className="font-orbitron text-slate-600 mt-2 text-sm">
              {t("stats.poweredBy")}
            </p>
            {lastVisit && (
              <p className="text-slate-500 mt-1 text-xs">
                {t("stats.lastVisit")} · {lastVisit}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-orbitron text-3xl md:text-4xl text-sky-300">100%</p>
            <p className="text-slate-400 mt-2">{t("stats.commitment")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
