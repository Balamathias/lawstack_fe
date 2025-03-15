import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Question } from "@/@types/db";
import { createQuestion, deleteQuestion, updateQuestion } from "../server/questions";
import { QUERY_KEYS } from "./query-keys";
import { toast } from "sonner";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.create_question],
    mutationFn: (payload: Partial<Omit<Question, "id" | "created_at" | "updated_at">>) => {
      return createQuestion(payload as Question);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("Question added successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_questions] });
      } else {
        toast.error(data?.message || "Failed to add question");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while adding the question"
      );
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.delete_question],
    mutationFn: (id: string) => {
      return deleteQuestion(id);
    },
    onSuccess: (data) => {
      if (data?.status === 204 || data?.data) {
        toast.success("Question deleted successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_questions] });
      } else {
        toast.error(data?.message || "Failed to delete question");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while deleting the question"
      );
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.update_question],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Question> }) => {
      return updateQuestion(id, payload);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("Question updated successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_questions] });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_question, data.data.id] 
        });
      } else {
        toast.error(data?.message || "Failed to update question");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while updating the question"
      );
    },
  });
};
