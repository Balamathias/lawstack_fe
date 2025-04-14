import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    sendNewsletter,
    createNewsletterCategory,
    updateNewsletterCategory,
    deleteNewsletterCategory,
    deleteSubscriber
} from '../server/newsletter';

// Types
interface CreateNewsletterParams {
    title: string;
    content: string;
    category?: string | null;
}

interface UpdateNewsletterParams {
    id: string;
    title?: string;
    content?: string;
    category?: string | null;
}

interface CreateCategoryParams {
    name: string;
    description?: string | null;
}

interface UpdateCategoryParams {
    id: string;
    name?: string;
    description?: string | null;
}

interface SendNewsletterParams {
    id: string;
    test_email?: string;
}

// Create a new newsletter
export const useCreateNewsletter = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: CreateNewsletterParams) => {
            return await createNewsletter(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsletters'] });
        },
    });
};

// Update a newsletter
export const useUpdateNewsletter = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateNewsletterParams) => {
            return await updateNewsletter(id, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['newsletters'] });
            queryClient.invalidateQueries({ queryKey: ['newsletters', variables.id] });
        },
    });
};

// Delete a newsletter
export const useDeleteNewsletter = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            return await deleteNewsletter(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsletters'] });
        },
    });
};

// Send a newsletter to subscribers
export const useSendNewsletter = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, test_email }: SendNewsletterParams) => {
            return await sendNewsletter(id, test_email);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['newsletters'] });
            queryClient.invalidateQueries({ queryKey: ['newsletters', variables.id] });
        },
    });
};

export const useCreateNewsletterCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: CreateCategoryParams) => {
            return await createNewsletterCategory(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsletters/categories'] });
        },
    });
};

export const useUpdateNewsletterCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, ...data }: UpdateCategoryParams) => {
            return await updateNewsletterCategory(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsletters/categories'] });
        },
    });
};

export const useDeleteNewsletterCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            return await deleteNewsletterCategory(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsletters/categories'] });
        },
    });
};

export const useDeleteSubscriber = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            return await deleteSubscriber(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsletters/subscribers'] });
        },
    });
};
