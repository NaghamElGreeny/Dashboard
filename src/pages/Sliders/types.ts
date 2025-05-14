export interface Slider {
    id: string;
    media?: string;
    name?: string;
    external_link?: string;

    is_active?: boolean;
    start_date?: string;
    end_date?: string;
}

export interface FetchSlidersData {
    data: Slider[];
    meta: any;
}
