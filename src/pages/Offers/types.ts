export interface Offer {
    id: string;
    start_at?: string;
    end_at?: string;
    created_at?: string;
    type?: string;
    is_active?: boolean;
}

export interface FetchData {
    data: Offer[];
    meta: any;
}
