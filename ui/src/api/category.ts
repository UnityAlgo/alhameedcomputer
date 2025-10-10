"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/api";


export type Category = {
  id: string;
  name: string;
  parent: string | null;
  image: string;
  created_at: string;
  updated_at: string;
};


export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(API_URL + "api/categories");
      return res.data;
    },
  });
};
