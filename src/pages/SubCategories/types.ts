export interface SubCategory {
    id: string;
    title?: string;
    image?: string;

}

export interface FetchSubCategoryData {
    data: SubCategory[];
    meta: any;
}
