"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from '@/components/products/product-card';
import { useSearchProducts } from '@/api/product';
import { SearchFilter } from "./search-filter";
import { Key } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { integer } from '@/utils';

const serializeParams = (params: URLSearchParams) => {
    const entries = Array.from(params.entries());
    const filtersObject = Object.fromEntries(entries);
    return filtersObject;
}



const Index = () => {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchProducts = useSearchProducts(serializeParams(params));
    const results = searchProducts.data?.results;

    const currentPage = integer(params.get("page")) || 1;

    const pageCount = results ? Math.ceil(results.total_count / results.page_size) : 0;


    const handlePageChange = (page: number) => {
        const updateed = new URLSearchParams(params.toString());
        updateed.set("page", page.toString());
        router.push(`${pathname}?${updateed.toString()}`);
    };

    const handleNext = () => {
        if (currentPage < pageCount) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };


    return <div className='max-w-6xl mx-auto'>
        {
            results ? (
                <div className='py-4 px-2'>
                    <div className='flex gap-2'>
                        <div className='w-52 pr-4 hidden lg:block shrink-0'>
                            <SearchFilter attributes={results.attributes} />
                        </div>

                        <div className="flex-1">
                            {params.get("query") && <div className='mb-4 text-sm'>
                                {results.total_count} items found for <span className='font-medium'>'{params.get("query")}'</span>
                            </div>}

                            {results.products.length ? <ProductGrid products={results.products} /> : <div className="flex items-center justify-center ">
                                <div className="text-center">
                                    <img src="https://cdn-icons-png.flaticon.com/512/6107/6107764.png" className="max-w-32" />
                                    <div>No Results Found</div>
                                    <div>Try a different keyword</div>
                                </div>
                            </div>}


                            {/*  */}
                            <ProductGrid products={results.products} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        {pageCount > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    handlePrev={handlePrev}
                                    handleNext={handleNext}
                                    setCurrentPage={handlePageChange}
                                    pageCount={pageCount}
                                    currentPage={currentPage}
                                />
                            </div>
                        )}
                    </div>

                </div>
            ) : <></>
        }
    </div>
}


const ProductGrid = ({ products }: { products: any[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
);


export default Index;