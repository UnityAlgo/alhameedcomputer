"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Product {
  cover_image: string;
  product_name?: string;
}


type MediaFile = {
  image: string | null;
  video: string | null;
}
export const ProductMedia = ({
  files,
  product,
}: {
  files: MediaFile[];
  product: Product;
}) => {
  
  // const image = files.map(file => file.image);
  const carouselItems = [
    product.cover_image,
    ...(files || []),
  ].filter((img): img is string => Boolean(img));


  const [selectedImage, setSelectedImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handlePrevious = () => {
    if (isTransitioning) return;
    setDirection("left");
    setIsTransitioning(true);
    setSelectedImage((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setDirection("right");
    setIsTransitioning(true);
    setSelectedImage((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    if (isTransitioning || index === selectedImage) return;
    setDirection(index > selectedImage ? "right" : "left");
    setIsTransitioning(true);
    setSelectedImage(index);
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, isTransitioning]);

  if (carouselItems.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div
          className={`w-full h-full transition-all duration-300 ${isTransitioning
            ? direction === "right"
              ? "opacity-0 translate-x-8"
              : "opacity-0 -translate-x-8"
            : "opacity-100 translate-x-0"
            }`}
        >
          <img
            src={carouselItems[selectedImage]}
            alt={product.product_name || "Product image"}
            className="w-full h-full object-contain p-4"
          />

        </div>

        {carouselItems.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md opacity-0  transition-opacity duration-200">
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </div> */}

        {carouselItems.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {selectedImage + 1} / {carouselItems.length}
          </div>
        )}
      </div>

      {carouselItems.length > 1 && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {carouselItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${index === selectedImage
                  ? ""
                  : "border-gray-200 hover:border-gray-300 hover:scale-105"
                  }`}
              >
                <img
                  src={item}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};