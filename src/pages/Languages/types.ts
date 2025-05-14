export interface Language {
    id: string;
    language?: string;
}

export interface FetchLanguageData {
    data: Language[];
    meta: any;
}
