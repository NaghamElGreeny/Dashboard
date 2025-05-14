export interface Category {
    id: string;
    image?: string;
    title?: string;

    subcategories?: [
        {
            id?: number;
            title?: string;
        }
    ];
}

export interface FetchCategoryData {
    data: Category[];
    meta: any;
}
