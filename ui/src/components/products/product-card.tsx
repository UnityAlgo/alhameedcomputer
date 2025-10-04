import Image from 'next/image';
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn, formatCurrency } from "@/utils";


export type ProductType = {
    id: string;
    brand: string;
    product_name: string;
    final_price: number;
    price: number | null;
    rating: number;
    reviews: number;
    cover_image: string;
    category: string;
    inStock: boolean;
};


const Rating = ({ count = 0, range = 5 }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(range)].map((_, i) => (
                <Star
                    key={i}
                    className={cn("h-4 w-4", i < Math.floor(count) ? "text-yellow-500 fill-current" : "text-gray-300")}
                />
            ))}
        </div>
    )
}


const ProductCard = ({ product }: { product: ProductType }) => (
    <Link
        href={`/products/${product.id}`}
        key={product.id}
    >
        <div className="rounded-md border border-border shadow-sm transition-all"
        >
            <div className="h-[240px] ">
                <img
                    src={product.cover_image || "/images/no-image.jpg"}
                    alt={product.product_name}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className='sm:h-[35%] p-2 flex flex-col justify-between gap-2'>
                <div>
                    <h4 className="text-sm h-10 line-clamp-2">
                        {product.product_name}
                    </h4>
                </div>

                <div><Rating count={product.rating} /></div>
                <div className="font-medium">{formatCurrency(product.price)}</div>
            </div>
        </div>
    </Link>
);


export { ProductCard };