import i18n from "../utils/languages/i18n";

interface CountryLanguageMap {
    [key: string]: string;
}

const detectCountryLanguage = async (setLanguage: (language: string) => void): Promise<void> => {
    // Mapping of country codes to language codes
    const countryToLanguageMap: CountryLanguageMap = {
        'US': 'en',
        'DE': 'de',
        'IT': 'it',
        'FR': 'fr',
    };

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode: string = data.country_code;

        const detectedLanguage: string = countryToLanguageMap[countryCode] || 'en';
        setLanguage(detectedLanguage);
        i18n.changeLanguage(detectedLanguage);
    } catch (error) {
        console.error('Error detecting country:', error);
    }
};

export default detectCountryLanguage;
