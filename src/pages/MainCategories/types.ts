export interface MainCategory {
    id: string;
    image?: string;
    title?: string;
    ordering?: number;
    gender?: string;
}

export interface FetchMainCategoryData {
    data: MainCategory[];
    meta: any;
}
