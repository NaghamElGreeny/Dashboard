export interface Buyer {
    buyer_id: string;
    name: string;
    image: string;
}

export interface Location {
    lat: string;
    lng: string;
    location_description: string;
}

export interface Product {
    id: string;
    name: string;
}
export interface Order {
    id: string;
    image?: string;
    status?: string;
    status_translated?: string;
    date?: string;
    buyer?: Buyer;
    location?: Location;
    code?: any;
    price?: number;
    product?: Product;
    product_buyers_count?: number;
    quantity?: number;
}

export interface FetchData {
    data: Order[];
    meta: any;
}
