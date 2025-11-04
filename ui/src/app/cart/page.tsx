"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCartQuery,
  useUpdateCartItem,
  useRemoveCartItem,
} from "@/api/cart";
import { useCreateOrder } from "@/api/orders";
import { float, integer } from "@/utils";
import { Spinner } from "@/components/ui/spinner";
import { EmptyCart } from "./empty-cart";
import { useCartStore } from "./store";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

const SHIPPING_COST = 500;

const Page = () => {
  const router = useRouter();
  const {
    items: cartItems,
    totalAmount,
    grandTotal,
    isGuest,
    updateQuantity: updateZustandQuantity,
    removeItem: removeZustandItem,
    setCartData,
  } = useCartStore();

  const { data: cartData, isLoading, isError } = useCartQuery();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const createOrder = useCreateOrder();

  
  useEffect(() => {
    "sync cart data from server to zustand store";
    if (!isGuest && cartData) {
      setCartData(
        cartData.items || [],
        cartData.total_amount || 0,
        cartData.grand_total || 0
      );
    }
  }, [cartData, isGuest, setCartData]);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    const qty = Math.max(1, integer(newQuantity));

    if (isGuest) {
      updateZustandQuantity(itemId, qty);
      toast.success("Quantity updated");
    } else {
      updateCartItem.mutate(
        { item_id: itemId, quantity: qty },
        {
          onSuccess: () => {
            toast.success("Quantity updated");
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update quantity"
            );
          },
        }
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (isGuest) {
      removeZustandItem(itemId);
      toast.success("Item removed from cart");
    } else {
      removeCartItem.mutate(itemId, {
        onSuccess: () => {
          toast.success("Item removed from cart");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to remove item"
          );
        },
      });
    }
  };

  const handleCheckout = () => {
    if (isGuest) {
      toast.error("Please sign in to complete your order");
      router.push("/login?redirect=/cart");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    createOrder.mutate(undefined, {
      onSuccess: (data) => {
        toast.success("Order created successfully!");
        router.push(`/orders/${data.order_id || ""}`);
      },
      onError: (err: any) => {
        console.error("Order create error:", err.response?.data || err);
        toast.error(
          err?.response?.data?.message || "Failed to create order"
        );
      },
    });
  };

  // Loading state
  if (!isGuest && isLoading) {
    return (
      <div className="py-16 flex justify-center flex-col items-center">
        <Spinner size="lg" className="mb-4" />
        <div className="text-gray-600">Loading your cart...</div>
      </div>
    );
  }

  // Empty or error state
  if (cartItems.length === 0 || (isError && isGuest)) {
    return <EmptyCart />;
  }

  const calculatedTotal = float(totalAmount) + SHIPPING_COST;

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
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  showDivider={index < cartItems.length - 1}
                  isUpdating={updateCartItem.isPending}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              subtotal={totalAmount}
              shippingCost={SHIPPING_COST}
              total={calculatedTotal}
              onCheckout={handleCheckout}
              isCheckingOut={createOrder.isPending}
              itemCount={cartItems.length}
              isGuest={isGuest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;