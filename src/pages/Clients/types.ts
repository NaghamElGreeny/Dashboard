export interface Client {
    id: string;
    full_name?: string;
    email?: string;

    phone?: number;
    phone_code?: number;
    user_type?: string;
    is_active?: any;
    is_banned?: any;
    birthdate: null;
}

export interface FetchClientData {
    data: Client[];
    meta: any;
}
