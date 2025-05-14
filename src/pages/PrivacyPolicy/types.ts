export interface Policy {
    id: string;
    title?: string;
    desc?: string;
    is_active?: string;
}

export interface FetchPolicyData {
    data: Policy[];
    meta: any;
}
