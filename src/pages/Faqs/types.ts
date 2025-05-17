export interface Faq {
    id: string;
    ar: {
        question?: string;
        answer?: string;
    };
    en: {
        question?: string;
        answer?: string;
    };
}

export interface FetchFaqData {
    data: Faq[];
    meta: any;
}
