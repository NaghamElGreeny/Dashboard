export interface AccountDeletionReason {
    id: string;
    reason?: string;
}

export interface FetchAccountDeletionReasonData {
    data: AccountDeletionReason[];
    meta: any;
}
