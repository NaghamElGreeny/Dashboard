export interface Faq {
    id: string;
    title?: string;
    desc?: string;
}

export interface FetchFaqData {
    data: Faq[];
    meta: any;
}
