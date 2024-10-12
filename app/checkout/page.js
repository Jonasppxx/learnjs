'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Stellen Sie sicher, dass Sie Ihren Stripe Public Key hier einfügen
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold my-8 text-gray-800">Checkout</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Ihr Warenkorb ist leer.</p>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Warenkorb Übersicht</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-700">{item.price.toFixed(2)} CHF</span>
            </div>
          ))}
          <p className="font-bold mt-4 text-gray-800">Gesamtsumme: {totalAmount} CHF</p>
          <button
            onClick={handleCheckout}
            className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
          >
            Zur Kasse
          </button>
        </div>
      )}
    </div>
  );
}
