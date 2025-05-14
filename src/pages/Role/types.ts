export interface Role {
    id: string;
    name?: string;
    permission?: [
        {
            id?: string;
            title?: string;
        }
    ];
}

export interface FetchRoleData {
    data: Role[];
    meta: any;
}
