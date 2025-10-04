"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUpdateCartItem } from "@/api/cart";

interface QuantitySelectorProps {
  itemId?: string;            
  initialQty?: number;        
  min?: number;            
  onChange?: (qty: number) => void; 
  className?: string;
}

export default function QuantitySelector({
  itemId,
  className = "",
  initialQty = 1,
  min = 1,
  onChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQty);
  const updateCartItem = useUpdateCartItem();

  const handleChange = (newQty: number) => {
    if (newQty < min) return;

    setQuantity(newQty);

    if (itemId) {
      updateCartItem.mutate(
        { item_id: itemId, quantity: newQty },
        {
          onSuccess: () => {
            toast.success("Cart updated");
          },
          onError: () => {
            toast.error("Failed to update cart");
          },
        }
      );
    }

    if (onChange) {
      onChange(newQty);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <button
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= min}
        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="px-3 py-3 text-sm font-medium min-w-[2rem] text-center">
        {quantity}
      </span>

      <button
        onClick={() => handleChange(quantity + 1)}
        className={`p-2 hover:bg-gray-100 ${className}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
