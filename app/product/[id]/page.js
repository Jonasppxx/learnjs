'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../CartContext';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setError('Fehler beim Laden des Produkts. Bitte versuchen Sie es später erneut.');
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className="text-center text-xl mt-8">Laden...</p>;
  if (error) return <p className="text-center text-xl mt-8 text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-xl mt-8">Produkt nicht gefunden</p>;

  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Zurück zur Übersicht
      </Link>
      <div className="md:flex md:space-x-8">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)} CHF</span>
            <button
              onClick={handleAddToCart}
              className={`px-6 py-2 ${isInCart ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded focus:outline-none focus:shadow-outline`}
              disabled={isInCart}
            >
              {isInCart ? 'Im Warenkorb' : 'In den Warenkorb'}
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={product.mainImage}
              alt={`${product.name} - Hauptbild`}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded"
            />
            <Image
              src={product.secondaryImage}
              alt={`${product.name} - Zusätzliches Bild`}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
