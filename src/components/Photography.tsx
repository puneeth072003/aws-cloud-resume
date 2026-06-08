import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { PHOTOS, PHOTOGRAPHY_PORTFOLIO_URL } from "../data/resume";

export function Photography() {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section id="photography" className="py-16 md:py-24 bg-black/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeading
          titleKey="photography.title"
          descriptionKey="photography.description"
        />

        <Reveal className="mt-16 relative" direction="none">
          <Swiper
            modules={[EffectCoverflow, Pagination, Keyboard, Mousewheel]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            keyboard={{ enabled: true }}
            mousewheel={{ thresholdDelta: 70 }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 3,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 2 },
              1560: { slidesPerView: 3 },
            }}
          >
            {PHOTOS.map((photo) => (
              <SwiperSlide
                key={photo}
                style={{ backgroundImage: `url("${photo}")` }}
                onClick={() => setActiveImage(photo)}
              />
            ))}
          </Swiper>
        </Reveal>

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

      <Lightbox src={activeImage} onClose={() => setActiveImage(null)} />
    </section>
  );
}
