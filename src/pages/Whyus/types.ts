export interface AboutImage {
    path: string;
    url: string;
}

export interface WhyUs {
    ar: {
        key: string;
    };
    en: {
        key: string;
    };
    icon?: AboutImage[] | any;
    id: number;
    is_active?: string;
    value: string;
}

export interface FetchWhyUsData {
    data: WhyUs[];
    meta: any;
}

// export interface AboutImage {
//     id: number;
//     media: string;
// }

// export interface About {
//     id: string;
//     title?: string;
//     desc?: string;
//     is_active?: string;

//     images?: AboutImage[] | any;
// }

// export interface FetchAboutData {
//     data: About[];
//     meta: any;
// }
