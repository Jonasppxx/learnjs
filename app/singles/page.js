'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../CartContext';
import { supabase } from '../../lib/supabase';

export default function Singles() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('singles')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        setProducts(data);
      } catch (error) {
        console.error('Error fetching singles:', error);
        setError('Fehler beim Laden der Singles. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Laden...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Singles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="group border border-transparent hover:border-blue-500 transition-all duration-300 p-2 rounded">
            <Link href={`/singles/${product.id}`} className="block">
              <Image src={product.main_image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain mb-2" />
              <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.price.toFixed(2)} CHF</p>
            </Link>
            <button
              onClick={() => addToCart(product, 'singles')}
              className={`w-full px-4 py-2 rounded ${
                isInCart(product.id, 'singles')
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isInCart(product.id, 'singles')}
            >
              {isInCart(product.id, 'singles') ? 'Im Warenkorb' : 'In den Warenkorb'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
