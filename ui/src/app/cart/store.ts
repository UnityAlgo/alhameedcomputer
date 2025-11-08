"use client";
import { create } from "zustand";
import { useAuthStore } from "@/features/auth";
import { Product } from "../(features)/(pages)/products/types";
import { float } from "@/utils";

export type CartItemType = {
  id: string;
  product: Product;
  qty: number;
  price: number;
  amount: number;
};

interface CartStore {
  items: CartItemType[];
  totalAmount: number;
  grandTotal: number;
  isGuest: boolean;

  setCartData: (items: CartItemType[], total: number, grand: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  syncAuthStatus: () => void;
  addItem: (item: CartItemType) => void;
}

const isBrowser = typeof window !== "undefined";

const getGuestCart = (): CartItemType[] => {
  if (!isBrowser) return [];
  try {
    const cart = localStorage.getItem("guest_cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items: CartItemType[]) => {
  if (!isBrowser) return;
  localStorage.setItem("guest_cart", JSON.stringify(items));
};

const calculateTotals = (items: CartItemType[]) => {
  const totalAmount = items.reduce((sum, item) => sum + float(item.amount), 0);
  const SHIPPING_COST = 500;
  const grandTotal = totalAmount + SHIPPING_COST;
  return { totalAmount, grandTotal };
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalAmount: 0,
  grandTotal: 0,
  isGuest: true,

  syncAuthStatus: () => {
    const authStore = useAuthStore.getState();
    const isAuthenticated = authStore.isAuthenticated;

    set({ isGuest: !isAuthenticated });

    if (isAuthenticated) {
      if (isBrowser) {
        localStorage.removeItem("guest_cart");
      }
    } else {
      const guestItems = getGuestCart();
      const { totalAmount, grandTotal } = calculateTotals(guestItems);
      set({ items: guestItems, totalAmount, grandTotal });
    }
  },

  setCartData: (items: CartItemType[], total: number, grand: number) => {
    set({
      items,
      totalAmount: total,
      grandTotal: grand,
    });
  },

  addItem: (newItem: CartItemType) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(
      (item) => item.product.id === newItem.product.id
    );

    let updatedItems: CartItemType[];

    if (existingItemIndex > -1) {
      updatedItems = items.map((item, index) =>
        index === existingItemIndex
          ? {
            ...item,
            quantity: item.quantity + newItem.quantity,
            amount: float(item.quantity + newItem.quantity) * float(item.price),
          }
          : item
      );
    } else {
      updatedItems = [...items, newItem];
    }

    const { totalAmount, grandTotal } = calculateTotals(updatedItems);
    set({ items: updatedItems, totalAmount, grandTotal });

    if (get().isGuest) {
      saveGuestCart(updatedItems);
    }
  },

  updateQuantity: (itemId: string, quantity: number) => {
    const items = get().items.map((item) =>
      item.id === itemId
        ? { ...item, quantity, amount: float(item.price) * float(quantity) }
        : item
    );
    const { totalAmount, grandTotal } = calculateTotals(items);
    set({ items, totalAmount, grandTotal });

    if (get().isGuest) {
      saveGuestCart(items);
    }
  },

  removeItem: (itemId: string) => {
    const items = get().items.filter((item) => item.id !== itemId);
    const { totalAmount, grandTotal } = calculateTotals(items);
    set({ items, totalAmount, grandTotal });

    if (get().isGuest) {
      saveGuestCart(items);
    }
  },

  clearCart: () => {
    set({ items: [], totalAmount: 0, grandTotal: 0 });
    if (isBrowser) {
      localStorage.removeItem("guest_cart");
    }
  },
}));

if (isBrowser) {
  useCartStore.getState().syncAuthStatus();
  useAuthStore.subscribe(() => {
    useCartStore.getState().syncAuthStatus();
  });
}