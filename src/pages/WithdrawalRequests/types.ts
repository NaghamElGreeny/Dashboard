export interface Request {
    id: string;
    account_number: number;
    iban: number;
    amount: number;
    status: string;
    bank_name: string;

    user_data: {
        id: number;
        name: string;
        image: string;
    };
}

export interface FetchRequestData {
    data: Request[];
    meta: any;
}
