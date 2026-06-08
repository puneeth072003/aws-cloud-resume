import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { SOCIAL_LINKS } from "../data/resume";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mt-16 text-center text-slate-400">
          <div className="flex justify-center gap-8 text-2xl">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <i className={`fab ${link.icon}`} />
              </a>
            ))}
          </div>
          <p className="font-orbitron mt-12 text-sm">{t("footer.builtWith")}</p>
          <p className="mt-8 text-sm">{t("footer.copyright")}</p>
        </Reveal>
      </div>
    </footer>
  );
}
