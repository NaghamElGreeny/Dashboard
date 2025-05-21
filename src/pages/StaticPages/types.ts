export interface Page {
    id: string;

    ar: { title?: string; description?: string };
    en: { title?: string; description?: string };
    is_active?: boolean;
    type?: string;
}

export interface FetchPagesData {
    data: Page[];
    meta: any;
}
