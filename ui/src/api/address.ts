"use client";

import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { axiosClient } from "@/api";

export interface TypeAddress {
  id: string;
  title: string;
  default: boolean;
  address_type: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string;
  email?: string;
  created_at?: string;
}

export const useAddressQuery = ({
  enabled = false,
  id
}: {
  enabled: boolean;
  id?: string;
}): UseQueryResult<TypeAddress[]> => {
  return useQuery({
    queryKey: ["get-address", id],
    queryFn: async () => {
      if (id) {
        const res = await axiosClient.get("api/user/address?id=" + id);
        return res.data;
      }

      const res = await axiosClient.get("api/user/address");
      return res.data;
    },
    enabled,
  });
};

export const useAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TypeAddress) => {
      if (payload.id) {
        const response = await axiosClient.put("api/user/address", payload);
        return response.data;
      }

      const response = await axiosClient.post("api/user/address", payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["get-address"] });
      if (variables.id) {
        queryClient.setQueryData(["get-address", variables.id], data);
      }
    },
  });
};

