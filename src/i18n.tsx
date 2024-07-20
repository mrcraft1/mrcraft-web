import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import config from "./config/config";
import { Resources } from "./typescriptTypes/globalTypes";


let resources: Resources = {}; // Initialize an empty object to store translation resources

// Loop through supported languages and dynamically load translation resources
config.supportedLanguages.forEach((language: string) => {
  resources[language] = {
    translation: require(`./Languages/${language}.json`),
  };
});

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: config.defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    resources: resources, // Use the dynamically loaded resources
  });

export default i18n;
