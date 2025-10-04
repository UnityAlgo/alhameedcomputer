"use client";

import { useState } from "react";
import QuantitySelector from "@/components/products/QuantitySelector";
import type { Product } from "@/app/(features)/(pages)/products/types";
import AddToCartButton from "@/components/products/AddToCartButton";
import BuyNowButton from "@/components/products/BuyButton";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="py-4">
      <div className="flex gap-4 items-center mb-8">
        
        <button className="bg-sucess text-primary-foreground py-2 px-6 rounded-md">Buy now</button>
        <button className="bg-primary text-primary-foreground py-2 px-6 rounded-md">Add to cart</button>

      </div>
      <div>
        <div className="font-semibold mb-2">What is the estimated delivery time?</div>
        <div className="text-sm">
          We understand the excitement you experience when shopping online. That’s why we’re equally excited to deliver the product without a scratch and as quickly as possible. While we try to get your product into your hands as fast as possible, all online orders usually take 3 to 4 days to be there. In extremely rare cases, it may take up to 7 working days. Like you, our valued staff likes to enjoy life as well. As such, the only times alhameedcomputers.com can’t deliver are Sundays and Public Holidays.
        </div>
      </div>

      {/* 
      <AddToCartButton
        productId={product.id}
        productName={product.product_name}
        quantity={quantity}
        className="flex-1 bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      />

      <BuyNowButton
        productId={product.id}
        productName={product.product_name}
        quantity={quantity}
        className="flex-1 bg-black hover:bg-black/95 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        label="Buy Now"
      /> */}

    </div>
  );
}


