export interface Review {
    id: string;

    user: {
        id?: string;
        image?: string;
        full_name?: string;
    };
    product: {
        id?: string;
        image?: string;
        full_name?: string;
    };
    created_at?: string;
    comment?: string;
    rate?: any;
}

export interface FetchReviewData {
    data: Review[];
    meta: any;
}
