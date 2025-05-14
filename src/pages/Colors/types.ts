export interface Color {
    id: string;
    title?: string;
    hex?: any;
}

export interface FetchColorsData {
    data: Color[];
    meta: any;
}
