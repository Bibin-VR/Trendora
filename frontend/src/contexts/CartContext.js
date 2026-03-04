import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, size, color) => {
    setLoading(true);
    try {
      await apiService.addToCart(productId, quantity, size, color);
      await fetchCart();
      setIsOpen(true);
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
    setLoading(false);
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await apiService.updateCartItem(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Update cart failed:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await apiService.removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart();
      setCart({ items: [], total: 0, item_count: 0 });
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, isOpen, setIsOpen, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
