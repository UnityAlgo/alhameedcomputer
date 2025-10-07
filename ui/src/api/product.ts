import { API_URL } from "@/_api/index";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/_api/axiosClient";
import axios from "axios";
import { ProductType } from "@/components/products/product-card";

type ProductParams = {
  search?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  in_stock?: boolean;
  sort?: string;
};


export const useProductsList = (params?: ProductParams) => {
  return useQuery({
    queryKey: ["get-products", params],
    queryFn: async (): Promise<ProductType[]> => {
      const { data } = await axios.get(`${API_URL}api/products`, {
        params,
      });
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
      const res = await axiosClient.get("api/products/search?", {
        params: args,
      });
      return res.data;
    },
    retry: 1,
  });

};
