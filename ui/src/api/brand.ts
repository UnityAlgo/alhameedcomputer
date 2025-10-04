import { API_URL } from "@/_api/index";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Brand {
  id: string;
  name: string;
  image?: string | null;
}

export const useBrandsList = () => {
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}api/brands`);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useBrandDetails = (id: string) => {
  return useQuery<Brand>({
    queryKey: ["brand", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}api/brands/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
