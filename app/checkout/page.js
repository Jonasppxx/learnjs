'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';

// Stellen Sie sicher, dass Sie Ihren Stripe Public Key hier einfügen
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Header hideSearch={true} hideCart={true} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
            <button
              onClick={handleGoBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
            >
              Zurück
            </button>
          </div>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src="/images/empty-cart-pokemon.png"
                alt="Leerer Warenkorb"
                width={150}
                height={150}
                className="mx-auto mb-4"
              />
              <p className="text-xl text-gray-600">Ihr Warenkorb ist leer.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Warenkorb Übersicht</h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-200 py-4">
                    <div className="flex items-center">
                      <Image
                        src={item.main_image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="mr-4"
                      />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-gray-700 font-semibold">{item.price.toFixed(2)} CHF</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800">Gesamtsumme:</span>
                <span className="text-2xl font-bold text-gray-800">{totalAmount} CHF</span>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-blue-700"
              >
                Zur Kasse
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
