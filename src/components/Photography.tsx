import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { PHOTOS, PHOTOGRAPHY_PORTFOLIO_URL } from "../data/resume";

export function Photography() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="photography" className="py-16 md:py-24 bg-black/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading
          titleKey="photography.title"
          descriptionKey="photography.description"
        />

        {/* Masonry gallery */}
        <div className="mt-16 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3]">
          {PHOTOS.map((photo, i) => (
            <motion.button
              key={photo}
              className="photo-tile group mb-4 block w-full overflow-hidden rounded-xl"
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <img
                src={photo}
                alt={`Photography ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="photo-tile__overlay">
                <i className="fas fa-expand" />
              </span>
            </motion.button>
          ))}
        </div>

        <Reveal className="text-center mt-12">
          <a
            href={PHOTOGRAPHY_PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            className="portfolio-cta inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-300"
          >
            <i className="fas fa-camera-retro mr-2" /> {t("photography.viewFull")}
          </a>
        </Reveal>
      </div>

      <Lightbox
        photos={PHOTOS}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
