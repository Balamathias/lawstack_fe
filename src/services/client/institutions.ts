import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Institution, createInstitution, deleteInstitution, getInstitution, getInstitutions, updateInstitution } from "../server/institutions";
import { QUERY_KEYS } from "./query-keys";
import { toast } from "sonner";

interface InstitutionPayload {
    params?: Record<string, string | number | boolean>;
}

export const useInstitutions = (payload?: InstitutionPayload) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_institutions, payload],
        queryFn: async () => {
            return getInstitutions(payload);
        },
    });
};

export const useInstitution = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_institution, id],
        queryFn: async () => {
            return getInstitution(id);
        },
        enabled: !!id,
    });
};

export const useCreateInstitution = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.create_institution],
        mutationFn: (payload: Omit<Institution, "id" | "created_at" | "updated_at">) => {
            return createInstitution(payload);
        },
        onSuccess: (data) => {
            if (data?.data) {
                toast.success("Institution added successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_institutions] });
            } else {
                toast.error(data?.message || "Failed to add institution");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while adding the institution"
            );
        },
    });
};

export const useUpdateInstitution = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.update_institution],
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Institution> }) => {
            return updateInstitution(id, payload);
        },
        onSuccess: (data) => {
            if (data?.data) {
                toast.success("Institution updated successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_institutions] });
                queryClient.invalidateQueries({ 
                    queryKey: [QUERY_KEYS.get_institution, data.data.id]
                });
            } else {
                toast.error(data?.message || "Failed to update institution");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while updating the institution"
            );
        },
    });
};

export const useDeleteInstitution = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.delete_institution],
        mutationFn: (id: string) => {
            return deleteInstitution(id);
        },
        onSuccess: (data) => {
            if (data?.status === 204 || data?.data) {
                toast.success("Institution deleted successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_institutions] });
            } else {
                toast.error(data?.message || "Failed to delete institution");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while deleting the institution"
            );
        },
    });
};
