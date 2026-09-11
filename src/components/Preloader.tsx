import { useTranslation } from "react-i18next";

/**
 * Intro overlay. Deliberately has no opaque backdrop — the hero canvas is
 * already live underneath, so the counter reads as a caption on the bars
 * flying in rather than a curtain that has to be pulled away.
 */
export function Preloader({
  progress,
  done,
}: {
  progress: number;
  done: boolean;
}) {
  const { t } = useTranslation();
  const percent = Math.round(progress * 100);

  return (
    <div
      className={`preloader ${done ? "preloader--done" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={t("loader.label", "Loading")}
    >
      <div className="preloader__rule">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="preloader__meta font-orbitron">
        <span className="preloader__label">
          {t("loader.label", "Loading")}
        </span>
        <span className="preloader__count">
          {String(percent).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
