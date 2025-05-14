export interface SpecialtyCase {
    id: string;
    title?: string;
}

export interface FetchSpecialtyCaseData {
    data: SpecialtyCase[];
    meta: any;
}
