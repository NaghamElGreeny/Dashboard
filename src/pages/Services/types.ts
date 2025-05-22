export interface Service {
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

export interface FetchServicesData {
    data: Service[];
    meta: any;
}
