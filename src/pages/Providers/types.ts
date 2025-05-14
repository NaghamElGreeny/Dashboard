export interface Provider {
    id: string;
    image?: string;
    full_name?: string;
    email?: string;
    university?: string;
    work_experience?: number;
    license_number?: string;
    medical_associations?: string;
    scientific_experience?: string;
    is_accepted?: any;
    is_active?: any;
    is_banned?: any;

    phone_code?: number;
    phone?: number;
    user_type?: string;
    bookings_count?: number;
    category_data?: {
        id?: number;
        title?: string;
    };
    subcategory_data?: {
        id?: number;
        title?: string;
    };
}

export interface FetchProvidersData {
    data: Provider[];
    meta: any;
}
