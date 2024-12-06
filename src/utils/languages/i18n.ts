import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './translations/en.json';
import deTranslation from './translations/de.json';
import frTranslation from './translations/fr.json';
import itTranslation from './translations/it.json';

// Initialize i18next
i18n
    .use(LanguageDetector) // Automatically detect user language
    .use(initReactI18next)  // Pass i18n instance to react-i18next
    .init({
        resources: {
            en: {
                translation: enTranslation,
            },
            de: {
                translation: deTranslation,
            },
            fr: {
                translation: frTranslation,
            },
            it: {
                translation: itTranslation,
            },
            // Add more languages here...
        },
        fallbackLng: 'en', // Fallback language if detection fails
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Detects language from URL, cookies, or browser
            caches: ['cookie'], // Stores the detected language in cookies
        },
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
