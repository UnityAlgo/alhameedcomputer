import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api";
import { float } from "@/utils";


interface Cart {
  items: CartItem[];
  total?: number;
  subtotal?: number;
}

interface CartItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
  amount: number;
}

interface UpdateCartItemPayload {
  item_id: string;
  quantity: number;
}

const updateCartItem = async (payload: UpdateCartItemPayload) => {
  const request = await axiosClient.put(
    `api/customer/cart/${payload.item_id}`,
    { quantity: payload.quantity }
  );
  return request.data;
};

const removeCartItem = async (itemId: string) => {
  const request = await axiosClient.delete(`api/customer/cart/${itemId}`);
  return request.data;
};

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

const useAddCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { product: string; quantity: number; action: string }) => {
      const request = await axiosClient.post(`api/customer/cart`, payload);
      return request.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["get-cart"], data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    }
  });
};

const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["get-cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["get-cart"]);
      
      if (previousCart) {
        queryClient.setQueryData<Cart>(["get-cart"], {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.id === variables.item_id
              ? {
                ...item,
                quantity: variables.quantity,
                amount: float(item.price) * float(variables.quantity),
              }
              : item
          ),
        });
      }

      return { previousCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["get-cart"], data.cart || data);
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["get-cart"], context.previousCart);
      }
      console.error("Update cart item error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
};
const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["get-cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["get-cart"]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(["get-cart"], {
          ...previousCart,
          items: previousCart.items.filter((item) => item.id !== itemId),
        });
      }

      return { previousCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["get-cart"], data.cart || data);
    },
    onError: (error, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["get-cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
};

export { useCartQuery, useAddCartMutation, useUpdateCartItem, useRemoveCartItem };