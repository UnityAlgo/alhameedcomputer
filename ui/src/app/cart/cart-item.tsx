// components/cart/CartItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency, integer } from "@/utils";
import { CartItemType } from "./store";
import { UseMutationResult } from "@tanstack/react-query";


type CartItemProps = {
  item: CartItemType;

  showDivider?: boolean;
  isUpdating?: boolean;

  mutation: UseMutationResult<any, Error, {
    product: string;
    qty: number;
    action: "add" | "remove";
  }, unknown>
};

export const CartItem: React.FC<CartItemProps> = ({
  item,
  mutation,
  showDivider = false,
  isUpdating = false,
}) => {
  if (!item) return <></>;

  const { product } = item;
  const category = item.product.category?.name;

  const handleUpdate = (action: "add" | "remove", qty = 1) => {

    mutation.mutate({ action, product: product.id, qty: qty });
  }

  const handleRemove = () => {
    mutation.mutate({ action: "remove", product: product.id, qty: 0 });
  }
  return (
    <div>
      <div className="p-3 md:p-4">
        <div className="flex gap-3 sm:gap-4">
          <Link
            href={`/products/${product.slug}`}
            className="flex-shrink-0"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
              <img
                src={product.cover_image}
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
                  href={`/products/${product.slug}`}
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

            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatCurrency(item.amount)} total
                </p>
              </div>


              <div className="flex items-center gap-2 border border-accent rounded-md overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleUpdate("add", integer(item.qty) - 1)}
                    disabled={integer(item.qty) <= 1}
                    className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors  cursor-pointer bg-accent hover:bg-accent/80"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4 stroke-2" />
                  </button>

                  <span className="min-w-[1rem] text-sm text-center">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => handleUpdate("add", integer(item.qty) + 1)}
                    className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-accent hover:bg-accent/80"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4 stroke-2" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="hidden sm:flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 mt-2 cursor-pointer"
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