export interface Feature {
    en: { value?: string };
    ar: { value?: string };
    key: string;
    icon?: {
        path: string;
        url: string;
    };
    is_active: 1;
}
export interface Section {
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

export interface FetchSectionsData {
    data: Section[];
    meta: any;
}
