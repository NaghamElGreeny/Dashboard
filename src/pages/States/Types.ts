export interface State {
    id: string;
    name?: string;
    country: {
        id?: string;
        name?: string;
    };
}

export interface FetchStateData {
    data: State[];
    meta: any;
}
