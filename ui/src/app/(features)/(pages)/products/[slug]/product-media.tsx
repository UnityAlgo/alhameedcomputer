"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, ZoomIn } from "lucide-react";
import { cn } from "@/utils";

interface Product {
  cover_image: string;
  product_name?: string;
}

type MediaItem = {
  image: string | null
  video: string | null
}


type MediaFile = {
  image: string | null;
  video: string | null;
}
export const ProductMedia = ({
  // images,
  files,
  product,
}: {
  files: MediaItem[]; product: Product;
}) => {

  const carouselItems: MediaItem[] = [
    {
      image: product.cover_image,
      video: null
    }
  ]

  files?.forEach(file => {
    carouselItems.push(file);
  })


  const [selected, setSelected] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handlePrevious = () => {
    if (isTransitioning) return;
    setDirection("left");
    setIsTransitioning(true);
    setSelected((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setDirection("right");
    setIsTransitioning(true);
    setSelected((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    if (isTransitioning || index === selected) return;
    setDirection(index > selected ? "right" : "left");
    setIsTransitioning(true);
    setSelected(index);
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
  }, [selected, isTransitioning]);

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
          {
            carouselItems[selected]?.image ? <img
              src={carouselItems[selected].image}
              alt={product.product_name || "Product image"}
              className="w-full h-full object-contain p-2"
            /> : carouselItems[selected]?.video ? <>
              <video className="h-full w-full object-contain p-2" autoPlay muted={true} src={carouselItems[selected].video}></video></>
              : <></>
          }

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
            {selected + 1} / {carouselItems.length}
          </div>
        )}
      </div>

      {carouselItems.length > 1 && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {carouselItems.map((file, index) => (
              file.image ? <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${index === selected
                  ? ""
                  : "border-gray-200 hover:border-gray-300 hover:scale-105"
                  }`}
              >
                <img
                  src={file.image}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-contain p-1"
                />
              </button>
                : file.video ? <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn("relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer")}
                >
                  <Play className="absolute size-5 m-auto inset-0 stroke-accent-foreground fill-accent" />
                  <video className="h-full w-full object-contain" muted={true} src={file.video}></video>
                </button> : <></>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};