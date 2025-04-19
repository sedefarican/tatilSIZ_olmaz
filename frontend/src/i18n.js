// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translationEN.json";
import translationTR from "./locales/tr/translationTR.json";

const resources = {
  en: { translation: translationEN },
  tr: { translation: translationTR },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
