'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../CartContext';
import { supabase } from '../../../lib/supabase';

export default function SingleProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('singles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          setProduct(data);
        } else {
          setError('Produkt nicht gefunden');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Fehler beim Laden des Produkts. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <p className="text-center text-xl mt-8">Laden...</p>;
  if (error) return <p className="text-center text-xl mt-8 text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-xl mt-8">Produkt nicht gefunden</p>;

  const handleAddToCart = () => {
    if (!isInCart(product.id, 'singles')) {
      addToCart(product, 'singles');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Link href="/singles" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Zurück zu Singles
        </Link>
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)} CHF</span>
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2 ${isInCart(product.id, 'singles') ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded focus:outline-none focus:shadow-outline`}
                disabled={isInCart(product.id, 'singles')}
              >
                {isInCart(product.id, 'singles') ? 'Im Warenkorb' : 'In den Warenkorb'}
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded">
                <Image
                  src={product.main_image}
                  alt={`${product.name} - Hauptbild`}
                  layout="fill"
                  objectFit="contain"
                  className="rounded"
                  priority
                />
              </div>
              {product.secondary_image && (
                <div className="relative aspect-square rounded">
                  <Image
                    src={product.secondary_image}
                    alt={`${product.name} - Zusätzliches Bild`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
