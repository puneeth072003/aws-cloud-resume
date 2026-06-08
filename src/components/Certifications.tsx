import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Reveal } from "./Reveal";
import { CERTIFICATION_KEYS, SKILL_RADAR } from "../data/resume";
import { useTheme } from "../hooks/useTheme";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function Certifications() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const data = useMemo(
    () => ({
      labels: SKILL_RADAR.labels,
      datasets: [
        {
          data: SKILL_RADAR.values,
          backgroundColor: "rgba(56, 189, 248, 0.2)",
          borderColor: "rgba(56, 189, 248, 1)",
          pointBackgroundColor: "rgba(56, 189, 248, 1)",
        },
      ],
    }),
    []
  );

  const options = useMemo<ChartOptions<"radar">>(() => {
    const gridColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)";
    const labelColor = isLight ? "#1f2937" : "#e2e8f0";
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200 },
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: { color: labelColor, font: { size: 12 } },
          ticks: { display: false, stepSize: 25 },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
      plugins: { legend: { display: false } },
    };
  }, [isLight]);

  return (
    <section id="skills" className="feature-section py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <Reveal className="feature-content" direction="left">
          <h2 className="font-orbitron text-3xl md:text-4xl text-white">
            {t("certifications.title")}
          </h2>
          <p className="mt-4 text-md md:text-lg text-slate-400">
            {t("certifications.description")}
          </p>
          <div className="mt-6 space-y-4">
            {CERTIFICATION_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-4 text-slate-300">
                <i className="fa fa-trophy text-sky-400 text-2xl w-8 text-center" />
                <p className="text-lg">{t(key)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" className="h-80 md:h-96 w-full relative">
          <Radar data={data} options={options} />
        </Reveal>
      </div>
    </section>
  );
}
