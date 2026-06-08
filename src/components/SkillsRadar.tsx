import { useMemo } from "react";
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
import { SKILL_RADAR } from "../data/resume";
import { useTheme } from "../hooks/useTheme";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/** Theme-aware radar chart of core DevOps proficiencies. */
export function SkillsRadar() {
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
          borderWidth: 2,
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

  return <Radar data={data} options={options} />;
}
