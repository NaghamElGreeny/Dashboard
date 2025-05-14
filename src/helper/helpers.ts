import { CountryPhoneCodes } from './country-phone-code';

// phonecode => 'EG'   phone=> 1032323232
export const formatPhoneNumber = (phonecode: string, phone: string): string => {
    const dial_code =
        CountryPhoneCodes.find((country) => `+${phonecode}` == country.dial_code.toLowerCase())
            ?.dial_code || '';
    return `${dial_code}${phone}`;
};

// Check language entered in inputs
export const isArabic = (value: any) =>
    /^[\u0600-\u06FF\s\d!@#$%^&*()_+=[\]{}|\\;:'",.<>?/-]+$/.test(value);
export const isEnglish = (value: any) =>
    /^[A-Za-z\s\d!@#$%^&*()_+=[\]{}|\\;:'",.<>?/-]+$/.test(value);
