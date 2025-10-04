"use client";

import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/_api/axiosClient";

export type Category = {
  id: string;
  name: string;
  parent: string | null;
  image: string;
  created_at: string;
  updated_at: string;
};

// -------- Fetch Categories --------
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosClient.get("api/categories");
      return res.data;
    },
  });
};
