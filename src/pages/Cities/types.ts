export interface CityLocale {
    name?: string;
}

export interface City {
    id: string;
    image?: string;
    name?: string;
    postal_code?: string;
    short_cut?: string;
    offline_session_availability?: string;
    country: {
        id?: string;
        name?: string;
    };
    location_data?: {
        id?: string;
        location?: string;
    };
}

export interface FetchCityData {
    data: City[];
    meta: any;
}
