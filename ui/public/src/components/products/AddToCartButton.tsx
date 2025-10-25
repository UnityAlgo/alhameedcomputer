"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/api/cart";

interface AddToCartButtonProps {
    productId: string;
    productName: string;
    quantity?: number;
    className?: string;
}

export default function AddToCartButton({
    productId,
    productName,
    quantity = 1,
    className = "",
}: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false);
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        setLoading(true);
        addToCart.mutate(
            {
                product_id: productId,
                quantity
            },
            {
                onSuccess: () => {
                    toast.success(`${productName} added to cart! 🛒`);
                    setLoading(false);
                },
                onError: (error: any) => {
                    toast.error(
                        error?.response?.data?.detail || "Failed to add to cart"
                    );
                    setLoading(false);
                },
            }
        );
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 ${className}`}
        >
            <ShoppingCart className="h-5 w-5" />
            {loading ? "Adding..." : "Add to Cart"}
        </button>
    );
}
