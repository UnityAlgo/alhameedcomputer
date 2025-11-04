"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Tag, Truck, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";

type CartSummaryProps = {
  subtotal: number;
  shippingCost: number;
  discount?: number;
  tax?: number;
  total: number;
  onCheckout: () => void;
  isCheckingOut?: boolean;
  itemCount?: number;
  isGuest?: boolean;
};

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingCost,
  total,
  onCheckout,
  isCheckingOut = false,
  itemCount = 0,
  isGuest = false,
}) => {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ShoppingBag className="h-4 w-4" />
          <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>



      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>


        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            Shipping
          </span>
          <span className="font-medium text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600 font-semibold">FREE</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        <hr className="border-gray-200" />


        <div className="flex justify-between text-lg font-bold pt-1">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>


      <div>
        <Button size="sm" className="w-full mb-2 cursor-pointer" onClick={onCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{isGuest ? "Sign In to Checkout" : "Proceed to Checkout"}</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <Link
          href="/"
          className="text-center block w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Continue Shopping
        </Link>

      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Easy 15-day returns</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Customer support 24/7</span>
        </div>
      </div>


    </div>
  );
};