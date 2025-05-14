export interface AboutImage {
    id: number;
    media: string;
}

export interface About {
    id: string;
    title?: string;
    desc?: string;
    is_active?: string;

    images?: AboutImage[] | any;
}

export interface FetchAboutData {
    data: About[];
    meta: any;
}
