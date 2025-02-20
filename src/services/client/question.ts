import { useQuery } from "@tanstack/react-query"
import { getTypingSuggestions } from "../server/questions"
import { QUERY_KEYS } from "./query-keys";

export const useQuestionSuggestions = (query: string) => {
    
    return useQuery({
        queryKey: [QUERY_KEYS.get_questions, query],
        queryFn: async () => {
            if (query.length === 0) return { data: [] }
            return getTypingSuggestions({ params: { q: query } })
        },
        // enabled: query.length > 0
    });
};