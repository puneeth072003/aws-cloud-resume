import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  titleKey: string;
  descriptionKey?: string;
}

/** Centered title + description used by several sections. */
export function SectionHeading({ titleKey, descriptionKey }: SectionHeadingProps) {
  const { t } = useTranslation();
  return (
    <Reveal className="text-center">
      <h2 className="font-orbitron text-3xl md:text-4xl text-white">{t(titleKey)}</h2>
      {descriptionKey && (
        <p className="mt-4 text-md md:text-lg text-slate-400 max-w-2xl mx-auto">
          {t(descriptionKey)}
        </p>
      )}
    </Reveal>
  );
}
