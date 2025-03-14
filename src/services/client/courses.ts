// Course hooks
import { useMutation, useQuery } from "@tanstack/react-query";
import { Course } from "@/@types/db";
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from "../server/courses";
import { QUERY_KEYS } from "./query-keys";

interface CoursePayload {
    params?: Record<string, string | number | boolean>;
}

export const useCourses = (payload?: CoursePayload) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_courses, payload],
        queryFn: async () => {
            return getCourses(payload);
        },
    });
};

export const useCourse = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_course, id],
        queryFn: async () => {
            return getCourse(id);
        },
    });
};

export const useCreateCourse = () => {
    return useMutation({
        mutationKey: [QUERY_KEYS.create_course],
        mutationFn: (payload: Course) => {
            return createCourse(payload);
        },
    });
};

export const useUpdateCourse = () => {
    return useMutation({
        mutationKey: [QUERY_KEYS.update_course],
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Course> }) => {
            return updateCourse(id, payload);
        },
    });
};

export const useDeleteCourse = () => {
    return useMutation({
        mutationKey: [QUERY_KEYS.delete_course],
        mutationFn: (id: string) => {
            return deleteCourse(id);
        },
    });
};
