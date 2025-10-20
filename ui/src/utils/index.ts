/* eslint-disable @typescript-eslint/no-explicit-any */
import { twMerge } from 'tailwind-merge'
import * as React from "react"

const MOBILE_BREAKPOINT = 768


function cn(...args: (string | null | undefined)[]): string {
    return twMerge(args.filter(String).join(" "));
}

function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }
        mql.addEventListener("change", onChange)
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        return () => mql.removeEventListener("change", onChange)
    }, [])

    return !!isMobile
}

function decimal(value: any, precision = 2) {
    const v = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    return v.toFixed(precision);
}

function formatCurrency(value: any, currency: string = "PKR"): string {
    if (isNaN(parseFloat(value))) return "₨ 0.00";
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: currency,
    }).format(value);
}

function float(value: any): number {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}

function integer(value: any): number {
    return isNaN(parseInt(value)) ? 0 : parseInt(value);
}

function isActiveURL(path: string): boolean {
    if (!path) return false;

    return window.location.pathname === path;
}

export const safeLocalStorage = {
    getItem(key: string) {
        if (typeof window === "undefined") return null;
        return localStorage?.getItem(key);
    },
    setItem(key: string, value: string) {
        if (typeof window === "undefined") return;
        localStorage?.setItem(key, value);
    },
    removeItem(key: string) {
        if (typeof window === "undefined") return;
        localStorage?.removeItem(key);
    },
};


export { float, formatCurrency, decimal, useIsMobile, cn, integer, isActiveURL };
