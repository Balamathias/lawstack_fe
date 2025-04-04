import { useQuery } from "@tanstack/react-query";
import { getInstitutions } from "../server/institutions";
import { QUERY_KEYS } from "./query-keys";

// Get all institutions
export const useGetInstitutions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_institutions, params],
    queryFn: async () => {
      return getInstitutions(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
