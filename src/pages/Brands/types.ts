export interface Brand {
    id: string;
    image: {
        id?: string;
        media?: string;
    };
    title?: string;
    desc?: string;

    created_at?: string;
}

export interface FetchBrandsData {
    data: Brand[];
    meta: any;
}
