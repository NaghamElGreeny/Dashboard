export interface Feature {
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
        path: string;
        url: string;
    };
    background: {
        path: string;
        url: string;
    };
}

export interface FetchFeaturesData {
    data: Feature[];
    meta: any;
}
