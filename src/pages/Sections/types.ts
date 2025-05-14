export interface SectionsImage {
    id: number;
    media: string;
}

export interface Sections {
    id: string;
    title?: string;
    desc?: string;
    is_active?: string;

    images?: SectionsImage[] | any;
}

export interface FetchSectionsData {
    data: Sections[];
    meta: any;
}
