import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { BLOG_COVER, BLOG_URL } from "../data/resume";

export function Blog() {
  const { t } = useTranslation();

  return (
    <section id="blogs" className="py-16 md:py-24 bg-black/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading titleKey="blog.title" descriptionKey="blog.description" />

        <div id="blog-grid" className="mt-16">
          <Reveal className="glass-pane rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <img
                  src={BLOG_COVER}
                  alt="Blog cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-3/5">
                <h3 className="font-orbitron text-2xl md:text-3xl text-white">
                  {t("blog.posts0title")}
                </h3>
                <div className="text-slate-300 mt-4 text-md md:text-lg space-y-4">
                  <p className="whitespace-pre-line">{t("blog.posts0excerpt")}</p>
                </div>
                <a
                  href={BLOG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-6 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors"
                >
                  {t("blog.readBlog")} →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
