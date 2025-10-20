import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api";

const useCartQuery = () => {
  return useQuery({
    queryKey: ["get-cart"],
    queryFn: async () => {
      const request = await axiosClient.get("api/customer/cart");
      return request.data;
    },
    retry: 3
  });
};

const useCartMutation = () => {
  return useMutation({
    mutationFn: async (payload: { product: string; quantity: number, action: string }) => {
      const request = await axiosClient.post(`api/customer/cart`, payload);
      return request.data;
    }
  });
};


export { useCartQuery, useCartMutation };


export const useCart = () => {
  return useQuery({
    queryKey: ["get-cart"],
    queryFn: async () => {
      const res = await axiosClient.get("api/cart/");
      return res.data;
    },
    // retry: 3
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { product_id: string; quantity: number }) => {
      const res = await axiosClient.post("api/cart/add/", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });

    },
    onError: (error: any) => {
      throw error.response?.data?.detail || "Failed to add to cart";
    },
  });
};

// -------- Update Item --------
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { item_id: string; quantity: number }) => {
      const res = await axiosClient.patch(`api/cart/${payload.item_id}/`, {
        quantity: payload.quantity,
        action: "update",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
};

// -------- Remove Item --------
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item_id: string) => {
      const res = await axiosClient.delete(`api/cart/${item_id}/remove/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
};

// -------- Clear Cart --------
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("api/cart/clear/");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
};