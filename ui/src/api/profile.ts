"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api";


export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosClient.get("api/profile");
      return res.data;
    },
    retry: 3,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      full_name?: string;
      phone_number?: string;
      profile_picture?: File;
    }) => {
      const formData = new FormData();
      formData.append("full_name", data.full_name ?? "");
      formData.append("phone_number", data.phone_number ?? "");
      if (data.profile_picture) {
        formData.append("profile_picture", data.profile_picture);
      }

      const res = await axiosClient.put("api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
