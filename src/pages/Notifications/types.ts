export interface Notification {
    id: string;
    title?: string;
    body?: string;
    is_readed?: any;
    created_at?: string;
    sending_time?: string;
    type?: string;
}

export interface FetchNotificationData {
    data: Notification[];
    meta: any;
}
