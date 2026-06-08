import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { BLOG_URL } from "../data/resume";

/**
 * Compact card (replaces the old full Blog section) noting the site was built
 * for the AWS Cloud Resume Challenge, linking to the write-up.
 */
export function BuiltWithCard() {
  const { t } = useTranslation();

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-6">
        <Reveal direction="up" className="max-w-2xl mx-auto">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noreferrer"
            className="glass-pane group flex items-center gap-4 md:gap-6 rounded-xl p-5 md:p-6"
          >
            <div className="flex-shrink-0 grid place-items-center w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xl">
              <i className="fab fa-aws" />
            </div>
            <div className="flex-1">
              <h3 className="font-orbitron text-white text-base md:text-lg">
                {t("builtWith.title")}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{t("builtWith.subtitle")}</p>
            </div>
            <i className="fas fa-arrow-right text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
