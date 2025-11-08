"use client";

import { useState } from "react";
import type { Product } from "@/app/(features)/(pages)/products/types";
import { useCartMutation } from "@/api/cart";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import useAuthStore from "@/features/auth";
interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [isLoading, setLoading] = useState(false);
  const cart = useCartMutation();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart.");
      router.push("/login?redirect=/products/" + product.slug);
      return;
    }

    cart.mutate({
      "product": product.id,
      "qty": 1,
      "action": "add"
    },
      {
        onSuccess: () => {
          toast.success("Added to cart successfully!");
          setTimeout(() => {
            router.push("/cart");
          }, 500)
        },
        onError: () => {
          toast.error("Server error! Please try again.");
        },
        onSettled: () => setLoading(false)
      }
    )
  };

  return (
    <div className="py-4">
      <div className="flex gap-4 items-center mb-8">

        <button className="bg-sucess text-primary-foreground py-2 px-6 rounded-md" onClick={handleAddToCart}>
          {isLoading ? <><Spinner color="light" size="md" /> Adding</> : <span>Add to cart</span>}
        </button>

      </div>
      <div>
        <div className="font-semibold mb-2">What is the estimated delivery time?</div>
        <div className="text-sm">
          We understand the excitement you experience when shopping online. That’s why we’re equally excited to deliver the product without a scratch and as quickly as possible. While we try to get your product into your hands as fast as possible, all online orders usually take 3 to 4 days to be there. In extremely rare cases, it may take up to 7 working days. Like you, our valued staff likes to enjoy life as well. As such, the only times alhameedcomputers.com can’t deliver are Sundays and Public Holidays.
        </div>
      </div>
    </div>
  );
}


