export interface Booking {
    id: string;

    service_data: {
        id: string;
        service: string;
    };

    total_price: string;
    date: string;
    time: string;
    created_at: string;
    status: string;
    status_translated: string;
    is_rescheduled: boolean;
}

export interface FetchBookingData {
    data: Booking[];
    meta: any;
}
