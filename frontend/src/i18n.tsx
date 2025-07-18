import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEnglish from "../locales/en/translactions.json";
import translationThai from "../locales/th/translactions.json";

const resources = {
    en: {
        translation: translationEnglish,
    },
    th: {
        translation: translationThai,
    },
};

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: "th",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    })

export default i18next;