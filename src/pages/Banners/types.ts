export interface Feature {
    // id: string;
    icon: {
        path: any;
        url: any;
    };
    key: string;
    ar: { value: string };
    en: { value: string };
}
export interface Banner {
    id: string;
    ar: {
        title?: string;
        description?: string;
    };
    en: {
        title?: string;
        description?: string;
    };
    icon: {
        path: any;
        url: any;
    };
    image: {
        path: any;
        url: any;
    };
    type: string;
    is_active: 0;
    features?: Feature[];
}

export interface FetchBannersData {
    data: Banner[];
    meta: any;
}
