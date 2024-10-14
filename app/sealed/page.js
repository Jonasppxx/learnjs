'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../CartContext';
import { supabase } from '../../lib/supabase';

export default function SealedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isInCart } = useCart();
  const productRefs = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sealed_products')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        setProducts(data);
      } catch (error) {
        console.error('Error fetching sealed products:', error);
        setError('Fehler beim Laden der Sealed Products. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img) {
              img.src = img.dataset.src;
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      productRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [products]);

  if (loading) return <p className="text-center py-4 mt-16">Laden...</p>;
  if (error) return <p className="text-center py-4 mt-16 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Sealed Products</h1>
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Zurück zur Startseite
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              ref={el => productRefs.current[index] = el}
              className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-blue-500"
            >
              <Link href={`/sealed/${product.id}`} className="block">
                <div className="relative pt-[100%] bg-gray-200">
                  <Image 
                    data-src={product.main_image}
                    alt={product.name} 
                    layout="fill" 
                    objectFit="contain" 
                    className="absolute top-0 left-0 w-full h-full p-2"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                  />
                </div>
                <div className="p-2 pb-4 absolute bottom-0 left-0 right-0 bg-white bg-opacity-80">
                  <h2 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 font-bold mt-1">
                    {product.price.toFixed(2)} CHF
                  </p>
                </div>
              </Link>
              <button
                onClick={() => addToCart(product, 'sealed')}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isInCart(product.id, 'sealed')
                    ? 'bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                disabled={isInCart(product.id, 'sealed')}
              >
                {isInCart(product.id, 'sealed') ? '✓' : '+'}
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
