import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import de from "./locales/de.json";

export const SUPPORTED_LANGUAGES = ["en", "de"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    nonExplicitSupportedLngs: true, // map en-US -> en
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "preferred-language",
      caches: ["localStorage"],
    },
  });

// Keep <html lang> and document <title>/description in sync with the language.
function syncDocumentMeta(lng: string) {
  document.documentElement.lang = lng;
  const title = i18n.t("meta.title");
  if (title) document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  const descText = i18n.t("meta.description");
  if (desc && descText) desc.setAttribute("content", descText);
}

i18n.on("languageChanged", syncDocumentMeta);
syncDocumentMeta(i18n.language);

export default i18n;
