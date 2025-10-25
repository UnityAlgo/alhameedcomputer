"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Star, ThumbsUp, User } from "lucide-react";
import { useProductDetails } from "@/api/product";

const ProductTab = () => {
  const { id } = useParams();

  const { data: product, isLoading: productLoading, error: productError } =
    useProductDetails(id as string);
  
  const [activeTab, setActiveTab] = useState("description");

  if (productLoading) {
    return <p className="text-gray-500 text-center py-8">Loading product...</p>;
  }

  if (productError || !product) {
    return <p className="text-red-500 text-center py-8">Failed to load product.</p>;
  }

  return (
    <div className="mt-16 w-full max-w-6xl mx-auto">
      <div className="border-b border-gray-200 overflow-x-auto hide-scrollbar whitespace-nowrap">
        <nav className="-mb-px flex gap-8">
          {["description", "specification"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-8 space-y-6">
        {activeTab === "description" && (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === "specification" && (
          <div>specification</div>
        )}
      </div>
    </div>
  );
};

export default ProductTab;
