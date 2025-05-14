export interface ReportReason {
    id: string;
    reason?: string;
    type?: string;
}

export interface FetchReportReasonData {
    data: ReportReason[];
    meta: any;
}
