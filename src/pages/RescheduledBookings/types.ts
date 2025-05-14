export interface RescheduledBooking {
    id: number;

    booking_data: {
        id: number;
        client_data: {
            id: number;
            full_name: string;
        };

        provider_data: {
            id: number;
            full_name: string;
        };

        service_data: {
            id: number;
            service: string;
        };
    };

    rescheduled_date: string;
    rescheduled_time: string;
    status: string;
}

export interface FetchRescheduledBookingData {
    data: RescheduledBooking[];
    meta: any;
}
