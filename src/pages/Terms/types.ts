export interface Terms {
    id: string;
    title?: string;
    desc?: string;
    is_active?: string;
}

export interface FetchTermsData {
    data: Terms[];
    meta: any;
}
