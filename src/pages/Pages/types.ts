export interface Page {
    id: string;

    title?: string;
    desc?: string;

    ordering?: number;
    type?: string;
}

export interface FetchPagesData {
    data: Page[];
    meta: any;
}
