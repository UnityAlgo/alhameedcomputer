import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

const useUserQuery = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await apiClient.get('api/user');
            return response.data;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
export { useUserQuery };

