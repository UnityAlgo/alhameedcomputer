"use client";

import React from 'react';
import { useProductsList } from "@/api/product";
import { ProductCard } from '@/components/products/product-card';
import { Spinner } from '@/components/ui/spinner';


const ProductsGird = () => {
    const { data, isLoading, error } = useProductsList("?type=deals,products");
    if (isLoading) {
        return <div className='py-16 flex justify-center flex-col items-center'>
            <Spinner size='lg' className='mb-4' />
            <div>Loading Products...</div>
        </div>;
    }



    const deals = data["deals"];
    const products = data["products"];

    if (!products || !products.length || error) {
        return (<div className="flex justify-center py-16">
            <div className='text-center'>
                <img src={"https://cdn-icons-png.flaticon.com/512/17597/17597096.png"} className='w-32 h-32 mx-auto' />
                <div >No products available.</div>
            </div>
        </div>)
    }


    return (
        <div>
            {
                deals?.length ?
                    <section className="py-8">
                        <div className='mb-4 font-semibold'>
                            Our Deals
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2" >
                            {deals.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section> : <></>
            }

            {products ? <section className="py-8">
                <div className='mb-4 font-semibold'>
                    HOT SALE
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2" >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section> : <></>}

        </div>
    );
};

export { ProductsGird }; 