// components/cart/CartItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils";
import { CartItemType } from "./store";


type CartItemProps = {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  showDivider?: boolean;
  isUpdating?: boolean;
};

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  showDivider = false,
  isUpdating = false,
}) => {

  console.log("CartItem render:", item);
  if (!item) return <></>;

  const { product } = item;
  const productImage = item.product.cover_image || "/placeholder.png";
  const category = item.product.category?.name;

  const handleIncrement = () => {
    onUpdateQuantity(item.id, Number(item.quantity) + 1);
  };

  const handleDecrement = () => {
    if (Number(item.quantity) > 1) {
      onUpdateQuantity(item.id, Number(item.quantity) - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div>
      <div className="p-3 md:p-4">
        <div className="flex gap-3 sm:gap-4">
          {/* Product Image */}
          <Link
            href={`/products/${item.product.slug}`}
            className="flex-shrink-0"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
              <Image
                src={productImage}
                alt={product.product_name}
                width={96}
                height={96}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-semibold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {product.product_name}
                </Link>
                {category && (
                  <p className="text-xs mt-1">
                    {category}
                  </p>
                )}
              </div>

              {/* Delete Icon - Mobile */}
              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="sm:hidden flex-shrink-0 p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                aria-label="Remove from cart"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom Section: Price and Quantity */}
            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatCurrency(item.amount)} total
                </p>
              </div>

              {/* Quantity Controls - Mobile Circular Style */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleDecrement}
                    disabled={Number(item.quantity) <= 1 || isUpdating}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <span className="text-base sm:text-lg font-semibold min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={handleIncrement}
                    disabled={isUpdating}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {isUpdating && (
                  <div className="ml-2">
                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="hidden sm:flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 mt-2"
              aria-label="Remove from cart"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      </div>
      {showDivider && <hr className="border-gray-200" />}
    </div>
  );
};