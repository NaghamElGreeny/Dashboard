export interface District {
    id: string;
    name?: string;
    city?: {
        id: string;
        name?: string;
    };
}

export interface FetchDistrictData {
    data: District[];
    meta: any;
}
