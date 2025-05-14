export interface User {
    id: string;
    image?: string;
    name?: string;
    phone_complete_form?: string;

    email?: string;
    date_of_birth?: string;
    gender?: string;
    country: {
        id?: string;
        name?: string;
    };

    is_ban?: boolean;
    is_active?: boolean;
}

export interface FetchUsersData {
    data: User[];
    meta: any;
}
