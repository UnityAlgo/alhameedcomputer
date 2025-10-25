"use client";

import { safeLocalStorage } from "@/utils";
import { useEffect, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const stored = safeLocalStorage.getItem("cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const stored = safeLocalStorage.getItem("cart");
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch {
          setCart([]);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateCart = (newCart: any[]) => {
    setCart(newCart);
    safeLocalStorage.setItem("cart", JSON.stringify(newCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      const stored = safeLocalStorage.getItem("cart");
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch {
          setCart([]);
        }
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  return { cart, updateCart };
}
