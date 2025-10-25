// import React from 'react'

// const ReviewPage = () => {
//     return (
//         <main className="max-w-6xl mx-auto px-2 md:px-4 py-4">
//             ReviewPage
//         </main>
//     )
// }

// export default ReviewPage
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
    Heart,
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
    Share2,
    MessageCircle,
    ThumbsUp,
    User,
    ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import RelatedProducts from "@/app/(features)/_components/related-products";

import { useProductDetails, useProductReviews } from "@/api/product";
import { useAddToCart} from "@/api/cart"; 
import axios from "axios";
// import { API_URL } from "../../../../../api";


const Index = () => {
    const { id } = useParams();
    console.log("Product ID from params:", id);

    const { data: product, isLoading, isError } = useProductDetails(id as string);
    const { data: reviewsData } = useProductReviews(id as string);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    const addToCart = useAddToCart();

    const renderStars = (rating: number, size = "h-4 w-4") => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`${size} ${i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    const handleQuantityChange = (action: "increment" | "decrement") => {
        if (!product) return;
        if (action === "increment") {
            setQuantity((prev) => Math.min(prev + 1, product.stock_count || 1));
        } else {
            setQuantity((prev) => Math.max(prev - 1, 1));
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center">Loading product...</div>;
    }

    if (isError || !product) {
        return <div className="p-10 text-center text-red-500">Product not found</div>;
    }

    const reviews = reviewsData || [];
    const images = product.images && product.images.length > 0
        ? product.images
        : [product.cover_image];


   
    const handleAddToCart = () => {
        if (!product) return;
        addToCart.mutate(
    {
      product_id: product.id,
      quantity: quantity,
    },
    {
      onSuccess: () => {
        toast.success(`${product.product_name} added to cart! 🛒`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Failed to add to cart");
      },
    }
  );
};

       return (
        <div className="max-w-6xl mx-auto">
            <div className="px-2 md:px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <Image
                                src={images[selectedImage]}
                                alt={product.product_name}
                                width={600}
                                height={600}
                                className="w-full h-full object-contain p-4"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                                        selectedImage === index 
                                            ? 'border-blue-500 ring-2 ring-blue-200' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.product_name} ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                {product.product_name}
                            </h1>
                            
                         
                        </div>

                        <div className="border-b pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.final_price}
                                </span>
                              
                                 {product.discount_price && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                        </div>

                      
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-900 mb-2 block">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange('decrement')}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('increment')}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={quantity >= (product.stock_count || 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addToCart.isPending}
                                    className="flex-1 bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {addToCart.isPending ? "Adding..." : "Add to Cart"}
                                </button>

                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`p-3 rounded-lg border transition-all ${
                                        isWishlisted
                                            ? 'bg-red-50 border-red-200 text-red-600'
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-gray-900">Key Features</h4>
                            <ul className="space-y-2">
                                {productData.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div> */}

                        
                    </div>
                </div>
                
                <div className="mt-16">
                    <div className="border-b border-gray-200 overflow-x-auto hide-scrollbar whitespace-nowrap">
                        <nav className="-mb-px flex gap-8">
                            {['description','reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                                        activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>



                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                {reviews.map((review: any) => (
                                    <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{review.user}</p>
                                                    <p className="text-sm text-gray-500">{review.created_at}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3">{review.comment}</p>
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                                 <ThumbsUp className="h-4 w-4" />
                                                 Helpful ({review.helpful || 0})
                                             </button>
                                             <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                                 <MessageCircle className="h-4 w-4" />
                                                 Reply
                                             </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div> 

                <div>
                    <RelatedProducts/>
                </div>
            </div>
        </div>
    );
};

export default Index;


// export const getServerSideProps = async (context: any) => {    
//     const product = {};
    
// return {
//     props: {
//         product
//     }
// }    
// }

// "use client";
// import React, { useState } from 'react';
// import Image from "next/image";
// import Link from "next/link";
// import { 
//     Heart, 
//     Star, 
//     Minus, 
//     Plus, 
//     ShoppingCart, 
//     Truck, 
//     Shield, 
//     RotateCcw,
//     ChevronLeft,
//     Share2,
//     MessageCircle,
//     ThumbsUp,
//     User,
//     ChevronRight
// } from 'lucide-react';
// import RelatedProducts from '@/app/(features)/_components/related-products';

// const productData = {
//     id: 1,
//     category: 'electronics',
//     title: "iPhone 16 Pro Max - Natural Titanium",
//     brand: "Apple",
//     rating: 4.8,
//     reviewCount: 2847,
//     originalPrice: 1299,
//     price: 1199,
//     discount: 8,
//     inStock: true,
//     stockCount: 15,
//     images: [
//         "/images/product1-4.jpg",
//         "/images/product1-3.jpg",
//         "/images/product1-2.jpg",
//         "/images/product1-4.jpg"
//     ],
//     colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
//     storage: ["128GB", "256GB", "512GB", "1TB"],
//     features: [
//         "A18 Pro chip with 6-core GPU",
//         "Pro camera system with 48MP Main",
//         "Up to 33 hours video playback",
//         "Titanium design with Action Button"
//     ],
//     description: "iPhone 16 Pro Max. Built for Apple Intelligence. Featuring a stunning titanium design, the most advanced Pro camera system ever, and the A18 Pro chip for incredible performance.",
//     specifications: {
//         "Display": "6.9-inch Super Retina XDR",
//         "Chip": "A18 Pro",
//         "Storage": "128GB, 256GB, 512GB, 1TB",
//         "Camera": "48MP Main, 48MP Ultra Wide, 12MP 5x Telephoto",
//         "Battery": "Up to 33 hours video playback",
//         "Operating System": "iOS 18"
//     }
// };

// const reviews = [
//     {
//         id: 1,
//         user: "John D.",
//         rating: 5,
//         date: "2 days ago",
//         comment: "Amazing phone! The camera quality is outstanding and the battery life is incredible.",
//         helpful: 24
//     },
//     {
//         id: 2,
//         user: "Sarah M.",
//         rating: 4,
//         date: "1 week ago", 
//         comment: "Great phone overall. Love the titanium design and the performance is smooth.",
//         helpful: 18
//     }
// ];

// const Index = () => {
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
//     const [selectedStorage, setSelectedStorage] = useState(productData.storage[0]);
//     const [quantity, setQuantity] = useState(1);
//     const [isWishlisted, setIsWishlisted] = useState(false);
//     const [activeTab, setActiveTab] = useState('description');

//     const renderStars = (rating: number, size = 'h-4 w-4') => {
//         return Array.from({ length: 5 }, (_, i) => (
//             <Star
//                 key={i}
//                 className={`${size} ${
//                     i < Math.floor(rating)
//                         ? 'fill-amber-400 text-amber-400'
//                         : 'text-gray-300'
//                 }`}
//             />
//         ));
//     };

//     const handleQuantityChange = (action: 'increment' | 'decrement') => {
//         if (action === 'increment') {
//             setQuantity(prev => Math.min(prev + 1, productData.stockCount));
//         } else {
//             setQuantity(prev => Math.max(prev - 1, 1));
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="bg-white border-b border-gray-200 overflow-x-auto whitespace-nowrap w-full hide-scrollbar">
//                 <div className="px-2 md:px-4 py-4 w-max ">
//                     <div className="flex items-center text-sm text-gray-500">
//                         <Link href="/" className="hover:text-gray-700">Home</Link>
//                         <ChevronRight className="w-max h-4 md:w-4 mx-2 " />
//                         <Link href="/products" className="hover:text-gray-700">Products</Link>
//                         <ChevronRight className="w-max h-4 md:w-4 mx-2"  />
//                         <Link href={`/products/${productData.category}`} className="hover:text-gray-700 capitalize">
//                             {productData.category}
//                         </Link>
//                         <ChevronRight className="w-max h-4 md:w-4 mx-2"  />
//                         <span className="text-gray-900 font-medium">{productData.title}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="px-2 md:px-4 py-4">
//                 <Link 
//                     href="/products"
//                     className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
//                 >
//                     <ChevronLeft className="h-4 w-4" />
//                     Back to Products
//                 </Link>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//                     <div className="space-y-4">
//                         <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden">
//                             <Image
//                                 src={productData.images[selectedImage]}
//                                 alt={productData.title}
//                                 width={600}
//                                 height={600}
//                                 className="w-full h-full object-contain p-4"
//                             />
//                         </div>

//                         <div className="flex gap-2 overflow-x-auto pb-2">
//                             {productData.images.map((image, index) => (
//                                 <button
//                                     key={index}
//                                     onClick={() => setSelectedImage(index)}
//                                     className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
//                                         selectedImage === index 
//                                             ? 'border-blue-500 ring-2 ring-blue-200' 
//                                             : 'border-gray-200 hover:border-gray-300'
//                                     }`}
//                                 >
//                                     <Image
//                                         src={image}
//                                         alt={`${productData.title} ${index + 1}`}
//                                         width={80}
//                                         height={80}
//                                         className="w-full h-full object-contain p-1"
//                                     />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="space-y-6">
//                         <div>
//                             <p className="text-sm text-gray-500 mb-2">{productData.brand}</p>
//                             <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
//                                 {productData.title}
//                             </h1>
                            
//                             <div className="flex items-center gap-2 mb-4">
//                                 <div className="flex items-center">
//                                     {renderStars(productData.rating)}
//                                 </div>
//                                 <span className="text-sm font-medium text-gray-700">
//                                     {productData.rating}
//                                 </span>
//                                 <span className="text-sm text-gray-500">
//                                     ({productData.reviewCount} reviews)
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="border-b pb-6">
//                             <div className="flex items-center gap-3 mb-2">
//                                 <span className="text-3xl font-bold text-gray-900">
//                                     ${productData.price.toLocaleString()}
//                                 </span>
//                                 <span className="text-xl text-gray-500 line-through">
//                                     ${productData.originalPrice.toLocaleString()}
//                                 </span>
//                                 <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
//                                     Save {productData.discount}%
//                                 </span>
//                             </div>
//                             <p className="text-sm text-green-600 font-medium">
//                                 ✓ In Stock ({productData.stockCount} available)
//                             </p>
//                         </div>

//                         <div>
//                             <h3 className="text-sm font-medium text-gray-900 mb-3">Color: {selectedColor}</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {productData.colors.map((color) => (
//                                     <button
//                                         key={color}
//                                         onClick={() => setSelectedColor(color)}
//                                         className={`px-3 py-2 text-sm rounded-lg border transition-all ${
//                                             selectedColor === color
//                                                 ? 'border-blue-500 bg-bluw-50 text-blue-700'
//                                                 : 'border-gray-300 hover:border-gray-400'
//                                         }`}
//                                     >
//                                         {color}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div>
//                             <h3 className="text-sm font-medium text-gray-900 mb-3">Storage: {selectedStorage}</h3>
//                             <div className="grid grid-cols-2 gap-2">
//                                 {productData.storage.map((storage) => (
//                                     <button
//                                         key={storage}
//                                         onClick={() => setSelectedStorage(storage)}
//                                         className={`px-3 py-2 text-sm rounded-lg border transition-all ${
//                                             selectedStorage === storage
//                                                 ? 'border-blue-500 bg-blue-50 text-blue-700'
//                                                 : 'border-gray-300 hover:border-gray-400'
//                                         }`}
//                                     >
//                                         {storage}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="text-sm font-medium text-gray-900 mb-2 block">Quantity</label>
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex items-center border border-gray-300 rounded-lg">
//                                         <button
//                                             onClick={() => handleQuantityChange('decrement')}
//                                             className="p-2 hover:bg-gray-100 transition-colors"
//                                             disabled={quantity <= 1}
//                                         >
//                                             <Minus className="h-4 w-4" />
//                                         </button>
//                                         <span className="px-4 py-2 font-medium">{quantity}</span>
//                                         <button
//                                             onClick={() => handleQuantityChange('increment')}
//                                             className="p-2 hover:bg-gray-100 transition-colors"
//                                             disabled={quantity >= productData.stockCount}
//                                         >
//                                             <Plus className="h-4 w-4" />
//                                         </button>
//                                     </div>
//                                     <span className="text-sm text-gray-500">
//                                         {productData.stockCount} available
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="flex gap-3">
//                                 <button className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
//                                     <ShoppingCart className="h-5 w-5" />
//                                     Add to Cart
//                                 </button>
//                                 <button
//                                     onClick={() => setIsWishlisted(!isWishlisted)}
//                                     className={`p-3 rounded-lg border transition-all ${
//                                         isWishlisted
//                                             ? 'bg-red-50 border-red-200 text-red-600'
//                                             : 'border-gray-300 hover:bg-gray-50'
//                                     }`}
//                                 >
//                                     <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
//                                 </button>
//                                 <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
//                                     <Share2 className="h-5 w-5" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//                             <h4 className="font-medium text-gray-900">Key Features</h4>
//                             <ul className="space-y-2">
//                                 {productData.features.map((feature, index) => (
//                                     <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
//                                         <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
//                                         {feature}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-green-100 rounded-lg">
//                                     <Truck className="h-5 w-5 text-green-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-medium">Free Shipping</p>
//                                     <p className="text-xs text-gray-500">On orders over $50</p>
//                                 </div>
//                             </div>
                            
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                     <RotateCcw className="h-5 w-5 text-blue-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-medium">30-Day Returns</p>
//                                     <p className="text-xs text-gray-500">Free returns</p>
//                                 </div>
//                             </div>
                            
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-purple-100 rounded-lg">
//                                     <Shield className="h-5 w-5 text-purple-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-medium">1-Year Warranty</p>
//                                     <p className="text-xs text-gray-500">Manufacturer warranty</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mt-16">
//                     <div className="border-b border-gray-200 overflow-x-auto hide-scrollbar whitespace-nowrap">
//                         <nav className="-mb-px flex gap-8">
//                             {['description', 'specifications', 'reviews'].map((tab) => (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
//                                         activeTab === tab
//                                             ? 'border-blue-500 text-blue-600'
//                                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }`}
//                                 >
//                                     {tab}
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>

//                     <div className="py-8">
//                         {activeTab === 'description' && (
//                             <div className="prose prose-gray max-w-none">
//                                 <p className="text-gray-700 leading-relaxed">
//                                     {productData.description}
//                                 </p>
//                             </div>
//                         )}

//                         {activeTab === 'specifications' && (
//                             <div className="grid grid-cols-1 gap-6">
//                                 {Object.entries(productData.specifications).map(([key, value]) => (
//                                     <div key={key} className="flex flex-col gap-2 md:flex-row justify-between py-3 border-b border-gray-100">
//                                         <span className="font-medium text-gray-900">{key}</span>
//                                         <span className="text-gray-700">{value}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {activeTab === 'reviews' && (
//                             <div className="space-y-6">
//                                 {reviews.map((review) => (
//                                     <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
//                                         <div className="flex items-start justify-between mb-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                                     <User className="h-5 w-5 text-gray-500" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-gray-900">{review.user}</p>
//                                                     <p className="text-sm text-gray-500">{review.date}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 {renderStars(review.rating)}
//                                             </div>
//                                         </div>
//                                         <p className="text-gray-700 mb-3">{review.comment}</p>
//                                         <div className="flex items-center gap-2">
//                                             <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
//                                                 <ThumbsUp className="h-4 w-4" />
//                                                 Helpful ({review.helpful})
//                                             </button>
//                                             <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
//                                                 <MessageCircle className="h-4 w-4" />
//                                                 Reply
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div>
//                     <RelatedProducts/>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Index

