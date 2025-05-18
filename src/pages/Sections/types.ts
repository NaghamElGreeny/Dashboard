import { Feature } from '../Features/types';

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
        path: string;
        url: string;
    };
    image: {
        path: string;
        url: string;
    };
    type: string;
    is_active: 0;
    features: Feature[];
}

export interface FetchSectionsData {
    data: Section[];
    meta: any;
}
