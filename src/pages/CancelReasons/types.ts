export interface CancelReason {
    id: string;
    reason?: string;
}

export interface FetchCancelReasonData {
    data: CancelReason[];
    meta: any;
}
