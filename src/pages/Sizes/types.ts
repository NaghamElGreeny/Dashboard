export interface Size {
    id: string;
    title?: string;
    tag?: string;
    ordering?: number;
}

export interface FetchSizesData {
    data: Size[];
    meta: any;
}
