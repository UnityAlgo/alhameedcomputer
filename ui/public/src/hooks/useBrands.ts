"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/api";

export type Brand = {
  id: string;
  name: string;
};

// -------- Fetch Brands --------
export const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axiosClient.get("api/brands");
      return res.data;
    },
  });
};
