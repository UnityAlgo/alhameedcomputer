"use client";

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { useSearchProducts } from '@/api/product';
import { SearchFilter } from "./search-filter";

const serializeParams = (params: URLSearchParams) => {
    const entries = Array.from(params.entries());
    return Object.fromEntries(entries);
}



const Index = () => {
    const params = useSearchParams();
    const searchProducts = useSearchProducts(serializeParams(params));

    console.log(searchProducts.data);
    return <div className='max-w-6xl mx-auto'>
        <div className='flex gap-2 py-4'>
            <div className='w-52 pr-4 hidden lg:block shrink-0'>
                <SearchFilter attributes={searchProducts.data?.results?.attributes} />
            </div>
            <ProductGrid products={searchProducts.data?.results?.products} />
        </div>
    </div>
}


const ProductGrid = ({ products }: { products: any[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
);


export default Index;