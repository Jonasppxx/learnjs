'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.find(item => item.id === product.id)) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Produkt wurde zum Warenkorb hinzugefügt!');
    } else {
      alert('Dieses Produkt ist bereits in Ihrem Warenkorb!');
    }
  };

  if (loading) return <p className="text-center text-xl mt-8">Laden...</p>;
  if (error) return <p className="text-center text-xl mt-8 text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-xl mt-8">Produkt nicht gefunden</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Zurück zur Übersicht
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-1 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)} CHF</span>
              <button
                onClick={addToCart}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              >
                In den Warenkorb
              </button>
            </div>
          </div>
        </div>
        <div className="p-8">
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
