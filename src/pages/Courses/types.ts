export interface Course {
    id: string;
    image?: string;
    title?: string;
    desc?: string;
    instructor_name?: string;
    client_registered_count?: number;
    videos?: [];

    course_category_data: { id: number; name: string };
    duration: number;
    is_active: boolean;
    price: number;
    videos_count: number;
    type: string;
}

export interface FetchCourseData {
    data: Course[];
    meta: any;
}
