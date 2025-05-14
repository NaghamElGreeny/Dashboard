export interface SubSubCategory {
    id: string;
    title?: string;
    ordering?: number;
    image?: string;

    category: {
        id: string;
        title?: string;
    };

    subcategory: {
        id: string;
        title?: string;
    };
}

export interface FetchSubSubCategoryData {
    data: SubSubCategory[];
    meta: any;
}
