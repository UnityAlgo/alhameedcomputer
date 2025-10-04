"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Slide = {
    img: string;
};

const HERO_SLIDES: Slide[] = [
    {
        img: "/images/carousel-1-1.webp",
    },
    {
        img: "/images/carousel-1-2.webp",
    },
    {
        img: "/images/carousel-1-3.webp",
    },
];


function HeroCarousel({ slides }: { slides: Slide[] }) {
    const [index, setIndex] = useState(0);
    const count = slides.length;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const next = () => setIndex((i) => (i + 1) % count);

    useEffect(() => {
        startAutoPlay();
        return stopAutoPlay;
    }, [index]);

    const startAutoPlay = () => {
        stopAutoPlay();
        intervalRef.current = setInterval(next, 3000);
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <div
            className="relative rounded-xl overflow-hidden bg-gray-100"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
        >
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {slides.map((s, i) => (
                    <div key={i} className="min-w-full relative h-[150px] md:h-[360px]">
                        <img
                            src={s.img}
                            alt=""
                            // fill
                            // sizes="100vw"
                            className="object-cover"
                        // priority={i === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${i === index ? "bg-white scale-110" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Carousel() {
    const slides = useMemo(() => HERO_SLIDES, []);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const { clientWidth } = scrollRef.current;
        scrollRef.current.scrollBy({
            left: dir === "right" ? clientWidth : -clientWidth,
            behavior: "smooth",
        });
    };

    return (
        <section className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 ">
            <HeroCarousel slides={slides} />
            <Link
                href="/products"
                className="relative rounded-xl overflow-hidden bg-gray-100 h-[150px] md:h-[360px] hidden md:block"
            >
                <img
                    src="/images/carousel-2-1.webp"
                    alt="pc build"
                    // fill
                    className="object-cover"
                />
            </Link>
        </section>
    );
};

