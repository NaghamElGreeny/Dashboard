export interface Order {
    id: string;
    order_no: string;
    coupon_value: number;
    discount_value: number;
    payment_type: string;
    shipping_value: number;
    sub_total: number;
    vat_value: number;
    total: number;
    status?: string;
    created_at?: string;
}

export interface FetchData {
    data: Order[];
    meta: any;
}
