'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../CartContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, isOpen, toggleCart, closeCart } = useCart();
  const cartRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const isCheckoutPage = pathname === '/checkout';

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCart();
        event.preventDefault();
        event.stopPropagation();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [closeCart, isOpen]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleCartClick = (event) => {
    event.stopPropagation();
  };

  const handleProductClick = (e, productId) => {
    e.stopPropagation();
    closeCart();
    router.push(`/product/${productId}`);
  };

  if (isCheckoutPage) {
    return null;
  }

  return (
    <div className="relative z-50">
      <button
        onClick={toggleCart}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        🛒 {cart.length}
      </button>
      {isOpen && (
        <div 
          ref={cartRef} 
          className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg z-50 p-4 rounded-lg"
          onClick={handleCartClick}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Warenkorb</h2>
            <button 
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          {cart.length === 0 ? (
            <p>Ihr Warenkorb ist leer.</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span 
                    onClick={(e) => handleProductClick(e, item.id)}
                    className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
                  >
                    {item.name}
                  </span>
                  <div>
                    <span className="mr-2">{item.price.toFixed(2)} CHF</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }} 
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="font-bold">Gesamtsumme: {totalAmount} CHF</p>
                <button
                  onClick={handleCheckout}
                  className="block w-full text-center bg-green-500 text-white py-2 rounded mt-4"
                >
                  Zur Kasse
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
