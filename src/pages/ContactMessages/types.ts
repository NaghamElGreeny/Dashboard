export interface Contact {
    id: string;
    full_name?: string;
    phone?: number;
    phone_code?: number;
    content?: string;
    created_at?: string;
    replies?: any;
}

export interface FetchContactsData {
    data: Contact[];
    meta: any;
}
