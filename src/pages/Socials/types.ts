export interface SocialLocale {
    name?: string;
}

export interface Social {
    id: string;
    icon?: string;
    en?: SocialLocale; // Assuming 'en' is one of the locales; add others as needed
    [locale: string]: SocialLocale | string | undefined; // For dynamic locale handling
    link?: string;
}

export interface FetchSocialsData {
    data: Social[];
    meta: any;
}
