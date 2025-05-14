export interface CountryLocale {
    name?: string;
}

export interface Country {
    id: string;
    image?: string;
    name?: string;
    short_name?: string;
    phone_code?: string;
    phone_limit?: string;
    currency?: string;
}

export interface FetchCountryData {
    data: Country[];
    meta: any;
}
