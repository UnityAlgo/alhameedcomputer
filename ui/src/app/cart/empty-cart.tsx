"use client";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export const EmptyCart = () => {
    return (
        <div className="min-h-[70vh] w-full py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-16">
                    <ShoppingBag className="h-24 w-24 mx-auto mb-4" />

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">
                            Your cart is empty
                        </h2>
                        <p >Start adding some products to your cart</p>
                    </div>
                    <Link
                        href="/"
                    >
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}