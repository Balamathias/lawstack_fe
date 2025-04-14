import { useMutation, useQuery } from '@tanstack/react-query';
import { StackResponse } from '@/@types/generics';
import { getNewsletter, getNewsletters, getSubscribers, unsubscribe, verifySubscription } from '../server/newsletter';
import VerifySubscription from '@/components/newsletter/verify-subscription';

interface SubscribeParams {
  email: string;
  first_name?: string;
  last_name?: string;
}

interface TokenParams {
  token: string;
}

interface NewsletterResponse {
  message?: string;
  error?: string;
}

interface Newsletter {
  id: string;
  title: string;
  content: string;
  sent_at: string;
  created_at: string;
  updated_at: string;
}

export const useSubscribeToNewsletter = () => {
  return useMutation({
    mutationFn: async (data: SubscribeParams) => {
      return await getSubscribers(data)
    },
  });
};

export const useVerifySubscription = () => {
  return useMutation({
    mutationFn: async (data: TokenParams) => {
      return await verifySubscription(data?.token)
    },
  });
};

export const useUnsubscribe = () => {
  return useMutation({
    mutationFn: async (data: TokenParams) => {
      return await unsubscribe(data?.token)
    },
  });
};

export const useGetNewsletters = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['newsletters', params],
    queryFn: async () => {
        return await getNewsletters(params);    },
  });
};

export const useGetNewsletter = (id: string) => {
  return useQuery({
    queryKey: ['newsletters', id],
    queryFn: async () => {
      return await getNewsletter(id);
    },
    enabled: !!id,
  });
};