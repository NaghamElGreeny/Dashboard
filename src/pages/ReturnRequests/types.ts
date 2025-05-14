export interface ReturnRequest {
    id: string;
    return_amount?: number;
    reason?: string;
    status?: string;
}

export interface FetchReturnRequestsData {
    data: ReturnRequest[];
    meta: any;
}
