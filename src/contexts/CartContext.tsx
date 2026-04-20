import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedColor: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, color: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const defaultValue: CartContextType = {
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
};

const CartContext = createContext<CartContextType>(defaultValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const addToCart = useCallback((product: Product, color: string) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id && item.selectedColor === color);
      if (existing) {
        return current.map(item =>
          item.cartId === existing.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, cartId: `${product.id}-${color}`, quantity: 1, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setItems(current => current.filter(item => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(current =>
      current.map(item => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { total, itemCount } = useMemo(() => {
    const total = items.reduce((sum, item) => {
      const itemPrice = item.discount_price || item.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  }, [items]);

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
