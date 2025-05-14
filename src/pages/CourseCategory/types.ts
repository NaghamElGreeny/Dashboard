export interface CourseCategory {
    id: string;

    ar: {
        name: string;
    };
    en: {
        name: string;
    };
}

export interface FetchCourseCategoryData {
    data: CourseCategory[];
    meta: any;
}
