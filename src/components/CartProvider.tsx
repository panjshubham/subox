"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // unique string for the cart item
  sizeId: number;
  sizeName: string;
  price: number;
  quantity: number;
  bulkDiscount: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  baseTotal: number;
  totalDiscount: number;
  cartTotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((current) => {
      const existing = current.find((i) => i.sizeId === newItem.sizeId);
      if (existing) {
        return current.map((i) =>
          i.sizeId === newItem.sizeId ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...current, newItem];
    });
  };

  const removeItem = (id: string) => setItems((current) => current.filter((i) => i.id !== id));
  
  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) => current.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const baseTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const totalDiscount = items.reduce((sum, item) => {
    if (item.quantity >= 100) {
       return sum + (item.price * item.quantity * (item.bulkDiscount / 100));
    }
    return sum;
  }, 0);

  const cartTotal = baseTotal - totalDiscount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, baseTotal, totalDiscount, cartTotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
