"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Heart, Star, ArrowRight, Tag } from 'lucide-react';
import { useProductsList } from "@/api/product";
import { ProductCard, ProductType } from '@/components/products/product-card';


const RelatedProducts = () => {
    const [isMobile, setIsMobile] = useState(false);

    const { data, isLoading, error } = useProductsList();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isLoading) return <p>Loading...</p>;
    
    if (error) {
        console.error("Product API error:", error);
        return <p>Something went wrong!</p>;
    }


    if (!data || !data.length) {
        return <div></div>
    }

    return (
        <section className="py-8">
            {/* className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 sm:grid-cols-3" */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2" >
                {data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts; 