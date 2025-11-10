"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Tag, Truck, ArrowRight, BanknoteArrowDown, MapPin, Phone, Mail } from "lucide-react";
import { cn, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CartType } from "./page";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TypeAddress, useAddressQuery } from "@/api/address";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@radix-ui/react-label";
import { AddressCard } from "../profile/address/page";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/api";

type CartSummaryProps = {
  cart: CartType
};

const AddressDialog = ({ onSelect }: { onSelect: (address: TypeAddress) => void }) => {
  const { data, isLoading } = useAddressQuery({ enabled: true });
  const [selected, setSelected] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No saved addresses found</p>
        <Button asChild>
          <Link href="/profile/address/new">Add New Address</Link>
        </Button>
      </div>
    );
  }

  const handleSelect = () => {
    const address = data.find((i: TypeAddress) => i.id === selected);
    if (address) {
      onSelect(address);
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Select Delivery Address</DialogTitle>
      </DialogHeader>

      <RadioGroup value={selected} onValueChange={setSelected}>
        {data.map((address, index) => (
          <RadioGroupItem
            key={index}
            value={address.id}
            className={cn("mb-4 w-full text-left rounded-md",
              selected === address.id
                ? "border border-blue-600 bg-blue-50"
                : "border border-gray-200 hover:border-gray-300")}
          >
            <AddressCard address={address} />
          </RadioGroupItem>
        ))}
      </RadioGroup>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSelect}
          disabled={!selected}
          className="flex-1"
        >
          Confirm Address
        </Button>
        <Button variant="outline" asChild>
          <Link href="/profile/address/new">Add New</Link>
        </Button>
      </div>
    </div>
  );
};


const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: async (payload: { cart_id: string; address_id: string; payment_method: string }) => {
      const response = await axiosClient.post("/api/orders/checkout", payload);
      return response.data
    },
    retry: 2,
  })
}


export const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<TypeAddress | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: checkoutMutate, isPending: isCheckoutPending } = useCheckoutMutation();
  const shippingCost = cart.grand_total > 50 ? 0 : 5.99;
  const finalTotal = cart.grand_total + shippingCost;

  const handleAddressSelect = (address: TypeAddress) => {
    setSelectedAddress(address);
    setIsDialogOpen(false);
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const payload = {
      cart: cart.id,
      address_id: selectedAddress.id,
      payment_method: "Cash on Delivery",
    }

    checkoutMutate(payload, {
      onSuccess: (data) => {
        toast.success("Order placed successfully");

        setTimeout(() => {
          router.push("/profile/orders");
        }, 500)
      },
      onError: (error: any) => {
        toast.error("Failed to place order please try again later");
        toast.success("You can also place an order by calling us at +92 302 9779392.");
      }
    })

  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ShoppingBag className="h-4 w-4" />
          <span>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</span>
        </div>
      </div>


      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(cart.grand_total)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Shipping
          </span>
          <span className="font-medium text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        {cart.grand_total < 50 && shippingCost > 0 && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Add {formatCurrency(50 - cart.grand_total)} more for free shipping
          </div>
        )}

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg font-bold pt-1">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="mb-4">
        <div className="font-bold text-sm mb-2">Payment Method</div>
        <div className="flex items-center gap-2 py-3 px-3 bg-gray-50 rounded-lg">
          <BanknoteArrowDown className="h-5 w-5 text-gray-600" />
          <div className="text-sm text-gray-700">Cash on Delivery</div>
        </div>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-sm">Delivery Address</div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" size="sm" className="h-auto p-0">
                {selectedAddress ? "Change" : "Select"}
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[25rem] w-full max-w-[600px]">
              <AddressDialog onSelect={handleAddressSelect} />
            </DialogContent>
          </Dialog>
        </div>

        {selectedAddress ? (
          <div className="space-y-2.5 mb-2 text-xs">
            <div>
              <p className="font-medium">{selectedAddress.address_line_1}</p>
              {selectedAddress.address_line_2 && (
                <p >{selectedAddress.address_line_2}</p>
              )}
              <p >
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
              </p>
              <p >{selectedAddress.country}</p>
            </div>

            <div className="space-y-1">
              {selectedAddress.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="size-3" />
                  <span>{selectedAddress.phone_number}</span>
                </div>
              )}
              {selectedAddress.email && (
                <div className="flex items-center gap-2">
                  <Mail className="size-3" />
                  <span>{selectedAddress.email}</span>
                </div>
              )}
            </div>
          </div>

        ) : (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>Please select a delivery address to continue</span>
          </div>
        )}

      </div>

      <div>
        <Button
          size="sm"
          className="w-full mb-2 cursor-pointer"
          onClick={handleCheckout}
          disabled={!selectedAddress || isCheckoutPending}
        >
          {
            isCheckoutPending ? <>Processing...</> : (<>Place Order <ArrowRight className="size-4 ml-2" /> </>)
          }
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