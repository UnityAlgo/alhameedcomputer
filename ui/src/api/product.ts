import { API_URL, axiosClient } from "@/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductType } from "@/components/products/product-card";


export const useProductsList = (params: string = "") => {
  return useQuery({
    queryKey: ["get-products"],
    queryFn: async (): Promise<Record<string, ProductType[]>> => {
      const { data } = await axios.get(`${API_URL}api/products${params}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};


export const useProductDetails = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}api/products/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useProductReviews = (id: string) => {
  return useQuery({
    queryKey: ["product-reviews", id],
    queryFn: async () => {

      const { data } = await axios.get(`${API_URL}api/products/${id}/reviews`);

      return data;
    },
    enabled: !!id,
    retry: 1,
  });
};

export const useSearchProducts = (args: Record<string, string>) => {

  return useQuery({
    queryKey: ["products", args],
    queryFn: async () => {
      const res = await axios.get(API_URL + "api/products/search?", {
        params: args,
      });
      return res.data;
    },
    retry: 1,
  });

};
