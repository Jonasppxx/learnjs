'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../CartContext';
import { useRouter, usePathname } from 'next/navigation';

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
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeCart, isOpen]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleProductClick = (e, productId, productType) => {
    e.stopPropagation();
    closeCart();
    if (productType === 'singles') {
      router.push(`/singles/${productId}`);
    } else if (productType === 'sealed') {
      router.push(`/sealed/${productId}`);
    } else {
      router.push(`/product/${productId}`);
    }
  };

  if (isCheckoutPage) {
    return null; // Verhindert die Anzeige des Warenkorbs auf der Checkout-Seite
  }

  return (
    <div className="relative z-50">
      <button
        onClick={toggleCart}
        className="text-white p-2 rounded-full" // Hintergrundfarbe entfernt
      >
        🛒 {cart.length}
      </button>
      {isOpen && (
        <div 
          ref={cartRef} 
          className="absolute top-0 right-0 mt-2 w-64 bg-white shadow-lg z-50 p-4 rounded-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Warenkorb</h2>
            <button 
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-600">Ihr Warenkorb ist leer.</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={`${item.id}-${item.productType}`} className="flex justify-between items-center mb-2">
                  <span 
                    onClick={(e) => handleProductClick(e, item.id, item.productType)}
                    className="cursor-pointer hover:text-blue-500 transition-colors duration-200 text-gray-800"
                  >
                    {item.name}
                  </span>
                  <div>
                    <span className="mr-2 text-gray-800">{item.price.toFixed(2)} CHF</span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.productType)} 
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="font-bold text-gray-800">Gesamtsumme: {totalAmount} CHF</p>
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