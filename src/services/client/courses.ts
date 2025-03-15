// Course hooks
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course } from "@/@types/db";
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from "../server/courses";
import { QUERY_KEYS } from "./query-keys";
import { toast } from "sonner";

// Get all courses with optional filtering
export const useCourses = (payload?: { params?: Record<string, string | number | boolean> }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_courses, payload],
    queryFn: async () => {
      return getCourses(payload);
    },
  });
};

// Get a single course by ID
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_course, id],
    queryFn: async () => {
      return getCourse(id);
    },
    enabled: !!id,
  });
};

// Create a new course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.create_course],
    mutationFn: (payload: Partial<Omit<Course, "id" | "created_at" | "updated_at">>) => {
      return createCourse(payload as Course);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("Course added successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_courses] });
      } else {
        toast.error(data?.message || "Failed to add course");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while adding the course"
      );
    },
  });
};

// Update an existing course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.update_course],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Course> }) => {
      return updateCourse(id, payload);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("Course updated successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_courses] });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_course, data.data.id] 
        });
      } else {
        toast.error(data?.message || "Failed to update course");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while updating the course"
      );
    },
  });
};

// Delete a course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.delete_course],
    mutationFn: (id: string) => {
      return deleteCourse(id);
    },
    onSuccess: (data) => {
      if (data?.status === 204 || data?.data) {
        toast.success("Course deleted successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_courses] });
      } else {
        toast.error(data?.message || "Failed to delete course");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while deleting the course"
      );
    },
  });
};
