export interface Feature {
    id: string;
    icon: {
        path: any;
        url: any;
    };
    key: string;
    ar: { value: string };
    en: { value: string };
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

export interface FetchSectionData {
    data: Section[];
    meta: any;
}
