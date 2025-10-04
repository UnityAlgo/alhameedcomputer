"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAddToCart } from "@/api/cart";

interface AddToCartButtonProps {
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  className?: string;
  label?: string;
}

export default function BuyNowButton({
  items,
  className = "",
  label = "Buy now",
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      await Promise.all(
        items.map((item) =>
          addToCart.mutateAsync({
            product_id: item.productId,
            quantity: item.quantity,
          })
        )
      );

      toast.success(`${items.length} item(s) added to cart! 🛒`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Failed to add some items to cart"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? "Adding..." : label}
    </button>
  );
}
