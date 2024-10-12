'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Geladene Produkte:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fehler beim Laden der Produkte:', error);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
        setLoading(false);
      });
  }, []);

  const isInCart = (productId) => cart.some(item => item.id === productId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold my-8 text-gray-800">Produkte</h1>
      {loading ? (
        <p className="text-gray-600">Laden...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white border p-4 rounded shadow-md flex flex-col">
              <Link href={`/product/${product.id}`} className="flex-grow">
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-700 hover:text-blue-500 mb-2">{product.name}</h2>
              </Link>
              <p className="font-bold text-gray-800 mb-2">{product.price.toFixed(2)} CHF</p>
              <button
                onClick={() => !isInCart(product.id) && addToCart(product)}
                className={`w-full px-4 py-2 rounded transition duration-300 ${
                  isInCart(product.id)
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isInCart(product.id)}
              >
                {isInCart(product.id) ? 'Im Warenkorb' : 'Zum Warenkorb hinzufügen'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
