import { useMutation, useQuery } from "@tanstack/react-query"
import { getTypingSuggestions } from "../server/questions"
import { QUERY_KEYS } from "./query-keys";
import { getQuestionInsights } from "../ai";
import { Question, User } from "@/@types/db";
import { useUser } from "./auth";
import axios from "axios";
import { toast } from "sonner";

export const useQuestionSuggestions = (query: string) => {
    
    return useQuery({
        queryKey: [QUERY_KEYS.get_questions, query],
        queryFn: async () => {
            if (query.length === 0) return { data: [] }
            return getTypingSuggestions({ params: { q: query } })
        },
    });
};

export const useQuestionInsights = () => {
    return useMutation({
        mutationKey: [QUERY_KEYS.get_question_insights],
        mutationFn: ({ question, user, prompt }: { question: Question, user: User, prompt: string }) => {
            return getQuestionInsights(prompt, question, user);
        },
    });
}


export const useQuestionInsights_Edge = () => {

    const { data: user } = useUser()
    
    return useMutation({
        mutationKey: [QUERY_KEYS.get_question_insights_edge],
        mutationFn: async ({ question, prompt }: { question: Question, user: User, prompt: string, }) => {
            const { data } = await axios.post('/api/ai/generate', {
                prompt,
                question,
                type: 'question',
                user
            });
            console.log(data)
            return data.insights as string | null
        },
        onError: (error) => {
            console.error(error)
            toast.error("Failed to generate insights, please try again")
        }
    });
}