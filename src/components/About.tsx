import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { AVATAR } from "../data/resume";

export function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-16 md:py-24 bg-black/20">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <Reveal direction="left">
          <img
            src={AVATAR}
            alt="Puneeth Y"
            className="md:w-80 md:h-80 mx-auto object-cover"
          />
        </Reveal>
        <Reveal direction="right">
          <h2 className="font-orbitron text-3xl md:text-4xl text-white">
            {t("about.title")}
          </h2>
          <p className="mt-4 text-md md:text-lg text-slate-300 leading-relaxed">
            <span className="text-sky-300 font-semibold">{t("about.intro")}</span>
            <br />
            <span>{t("about.description")}</span>
          </p>
          <p className="mt-4 text-md md:text-lg text-slate-300 leading-relaxed">
            {t("about.hobby")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
