import { useMutation } from "@tanstack/react-query";
import { Question, User, Contribution } from "@/@types/db";
import axios from "axios";
import { QUERY_KEYS } from "./query-keys";
import { useQuery } from '@tanstack/react-query';
import { analyzeSearchQuery } from '../server/ai';
import { StackResponse } from "@/@types/generics";

interface AIInsightParams {
  prompt: string;
  user: User | null;
  content?: string;
  contentId?: string;
  question?: Question;
  contribution?: Contribution;
  type?: 'question' | 'contribution' | 'chat';
  messages?: Array<{role: string, content: string}>;
}

/**
 * Hook for generating AI insights using Edge runtime
 */
export const useAIInsights = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.ai_insights],
    mutationFn: async ({
      prompt,
      user,
      question,
      contribution,
      type = 'question',
      messages
    }: AIInsightParams) => {
      const { data } = await axios.post('/api/ai/generate', {
        prompt,
        question,
        contribution,
        type,
        user,
        messages
      });

      return data.insights as string;
    }
  });
};

/**
 * Function to get question insights
 */
export const getQuestionInsights = async ({
  prompt,
  question,
  user
}: {
  prompt: string;
  question: Question;
  user: User | null;
}): Promise<string> => {
  const { data } = await axios.post('/api/ai/generate', {
    prompt,
    question,
    type: 'question',
    user
  });

  return data.insights as string;
};

/**
 * Function to get contribution insights
 */
export const getContributionInsights = async ({
  prompt,
  question,
  contribution,
  user
}: {
  prompt: string;
  question: Question;
  contribution: Contribution;
  user?: User | null;
}): Promise<string> => {
  const { data } = await axios.post('/api/ai/generate', {
    prompt,
    question,
    contribution,
    type: 'contribution',
    user
  });

  return data.insights as string;
};

/**
 * Function to get chat completion with context
 */
export const getChatCompletion = async ({
  messages,
  user
}: {
  messages: Array<{role: string, content: string}>;
  user: User | null;
}): Promise<string> => {
  const { data } = await axios.post('/api/ai/generate', {
    messages,
    type: 'context', 
    user
  });

  return data.insights as string;
};

interface SearchAnalysisResults {
  analysis: string;
  relatedTopics: string[];
  suggestedResources: string[];
}

/**
 * Custom hook to get AI-powered analysis of a search term
 * Only fetches data when explicitly requested by the user
 */
export function useAnalyzeSearch(query: string) {
  return useQuery<StackResponse<SearchAnalysisResults>>({
    queryKey: QUERY_KEYS.aiAnalysis(query),
    queryFn: async () => {
      const result = await analyzeSearchQuery(query);
      return result
    },
  });
}
