export interface Report {
    id: string;
    report_reason_data: {
        id: string;
        reason: string;
    };

    appointment_booking_data: {
        id: string;

        client_data: {
            id: string;
            full_name: string;
        };

        provider_data: {
            id: string;
            full_name: string;
        };
        service_data: {
            id: string;
            service: string;
        };
    };
    reported_by: string;
    created_at: string;
}

export interface FetchReportData {
    data: Report[];
    meta: any;
}
