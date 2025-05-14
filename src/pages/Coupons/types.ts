export interface Coupon {
    id: string;
    code?: string;
    value?: string;
    max_limit?: string;
    user_limit?: string;
    type?: string;

    start_date?: string;
    start_time?: string;
    end_date?: string;
    end_time?: string;
    is_active?: any;
}

export interface FetchCouponData {
    data: Coupon[];
    meta: any;
}
