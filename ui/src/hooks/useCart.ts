"use client";

import { useEffect, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
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
      const stored = localStorage.getItem("cart");
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
    localStorage.setItem("cart", JSON.stringify(newCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      const stored = localStorage.getItem("cart");
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
