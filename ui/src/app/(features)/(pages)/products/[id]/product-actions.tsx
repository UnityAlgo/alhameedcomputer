"use client";

import { useState } from "react";
import QuantitySelector from "@/components/products/QuantitySelector";
import type { Product } from "@/app/(features)/(pages)/products/types";
import AddToCartButton from "@/components/products/AddToCartButton";
import BuyNowButton from "@/components/products/BuyButton";
import { useAddToCart } from "@/api/cart";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import useAuthStore from "@/features/auth";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [isLoading, setLoading] = useState(false);
  const addToCart = useAddToCart();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setLoading(true);
    addToCart.mutate(
      {
        product_id: product.id,
        quantity: 1
      },
      {
        onSuccess: () => {
          toast.success(product.product_name + ` added to cart! 🛒`);
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
    <div className="py-4">
      <div className="flex gap-4 items-center mb-8">

        {/* <button className="bg-sucess text-primary-foreground py-2 px-6 rounded-md">Buy now</button> */}
        <button className="bg-sucess text-primary-foreground py-2 px-6 rounded-md" onClick={handleAddToCart}>

          {/* Add to cart  */}
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


