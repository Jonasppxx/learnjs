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

  if (loading) return <p className="text-center py-4 mt-16">Laden...</p>;
  if (error) return <p className="text-center py-4 mt-16 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Pokémon Singles</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map(product => (
            <div key={product.id} className="group relative">
              <Link href={`/singles/${product.id}`} className="block">
                <div className="relative w-full pt-[100%] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src={product.main_image} 
                    alt={product.name} 
                    layout="fill" 
                    objectFit="contain" 
                    className="absolute top-0 left-0 w-full h-full p-2"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2">
                    <h2 className="text-sm md:text-base font-semibold text-gray-800 truncate">{product.name}</h2>
                    <p className="text-sm text-gray-600 font-bold mt-1">{product.price.toFixed(2)} CHF</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => addToCart(product, 'singles')}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isInCart(product.id, 'singles')
                    ? 'bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                disabled={isInCart(product.id, 'singles')}
              >
                {isInCart(product.id, 'singles') ? '✓' : '+'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="mt-auto border-t pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8">
            <Link href="/datenschutz" className="text-blue-500 hover:underline">Datenschutzerklärung</Link>
            <Link href="/agb" className="text-blue-500 hover:underline">AGB</Link>
            <Link href="/impressum" className="text-blue-500 hover:underline">Impressum</Link>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2024 Pokebuy. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
