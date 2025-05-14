export interface Image {
    path: string;
    url: string;
}

export interface Admin {
    id: string;
    image?: string;
    full_name?: string;
    email?: string;
    is_active?: any;

    role: {
        id: number;
        name: string;
    };
}

export interface FetchData {
    data: Admin[];
    meta: any;
}
