"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useUpdateCartItem,
  useRemoveCartItem,
  useAddCartMutation,
  useCartMutation,
} from "@/api/cart";
import { useCreateOrder } from "@/api/orders";
import { float, integer } from "@/utils";
import { Spinner } from "@/components/ui/spinner";
import { EmptyCart } from "./empty-cart";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/api";

const SHIPPING_COST = 500;


type CartItemType = {
  id: string
  product: {
    product_name: string,
    slug: string,
    cover_image: string,
    category?: {
      id: string,
      name: string
    }
  },
  qty: number,
  price: number,
  amount: number
}

export interface CartType {
  grand_total: number;
  id: string;
  total_amount: number;
  total_qty: number;
  updated_at: string;
  items: CartItemType[]
}


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


const Page = () => {

  const { data: cartData, isLoading, isError } = useCartQuery();
  const cartMutation = useCartMutation();
  const cartItems = cartData?.items || [];



  if (isLoading) {
    return (
      <div className="py-16 flex justify-center flex-col items-center">
        <Spinner size="lg" className="mb-4" />
        <div className="text-gray-600">Loading your cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0 || isError) {
    return <EmptyCart />;
  }



  return (
    <div className="min-h-[70vh] w-full py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-2 sm:mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="text-lg font-bold">
            Shopping Cart ({cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  mutation={cartMutation}
                  item={item}
                  showDivider={index < cartItems.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              cart={cartData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;