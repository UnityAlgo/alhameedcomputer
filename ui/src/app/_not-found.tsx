"use client";
import { safeLocalStorage } from "@/utils";
import { useEffect } from "react";

export default function NotFoundPage() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            safeLocalStorage.removeItem('something');
        }
    }, []);

    return <h1>Page not found</h1>;
}
