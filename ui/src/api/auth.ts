import axios from "axios";
import { safeLocalStorage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from ".";


const useUserQuery = () => {
    const tokens = safeLocalStorage.getItem("tokens");
    const acessToken = tokens ? JSON.parse(tokens).access : null;

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await axios.get(API_URL + 'api/user', {
                headers: {
                    Authorization: `Bearer ${acessToken}`,
                }
            });
            return response.data;
        },
        enabled: acessToken !== null,
        retry: 2,

    });
}

export { useUserQuery };