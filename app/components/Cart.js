'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../CartContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Cart() {
  const { cart, removeFromCart, isOpen, toggleCart, closeCart } = useCart();
  const cartRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Prüfen, ob wir uns auf der Checkout-Seite befinden
  const isCheckoutPage = pathname === '/checkout';

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCart();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeCart]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  // Wenn wir auf der Checkout-Seite sind, zeigen wir den Cart nicht an
  if (isCheckoutPage) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleCart}
        className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        🛒 {cart.length}
      </button>
      {isOpen && (
        <div ref={cartRef} className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-4 overflow-y-auto">
          <button onClick={closeCart} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-4">Warenkorb</h2>
          {cart.length === 0 ? (
            <p>Ihr Warenkorb ist leer.</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name}</span>
                  <div>
                    <span className="mr-2">{item.price.toFixed(2)} CHF</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
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
