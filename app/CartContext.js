'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product, productType) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, { ...product, productType }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productId, productType) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => !(item.id === productId && item.productType === productType));
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const isInCart = (productId, productType) => {
    return cart.some((item) => item.id === productId && item.productType === productType);
  };

  const toggleCart = () => setIsOpen(!isOpen);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, isOpen, toggleCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
