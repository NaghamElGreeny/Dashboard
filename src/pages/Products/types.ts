export interface Product {
    id: number;
    title?: string;
    short_desc?: string;
    main_image?: {
        id: number;
        url: string;
        media: string;
    };
    created_at?: string;

    category?: {
        id: string;
        title?: string;
    };

    sub_category?: {
        id: string;
        title?: string;
    };
    sub_sub_category?: {
        id: string;
        title?: string;
    };
}

export interface FetchData {
    data: Product[];
    meta: any;
}
