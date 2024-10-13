'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { useCart } from '../CartContext';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q');
  const origin = searchParams.get('origin') || 'singles'; // Default to 'singles' if not specified
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let singles, sealedProducts;

        if (query) {
          // Fetch filtered results if there's a query
          const { data: filteredSingles, error: singlesError } = await supabase
            .from('singles')
            .select('*')
            .ilike('name', `%${query}%`)
            .or(`description.ilike.%${query}%`);

          const { data: filteredSealed, error: sealedError } = await supabase
            .from('sealed_products')
            .select('*')
            .ilike('name', `%${query}%`)
            .or(`description.ilike.%${query}%`);

          if (singlesError) throw singlesError;
          if (sealedError) throw sealedError;

          singles = filteredSingles;
          sealedProducts = filteredSealed;
        } else {
          // Fetch all products if there's no query
          const { data: allSingles, error: singlesError } = await supabase
            .from('singles')
            .select('*');

          const { data: allSealed, error: sealedError } = await supabase
            .from('sealed_products')
            .select('*');

          if (singlesError) throw singlesError;
          if (sealedError) throw sealedError;

          singles = allSingles;
          sealedProducts = allSealed;
        }

        // Combine and set results
        const combinedResults = [
          ...singles.map(item => ({ ...item, type: 'singles' })),
          ...sealedProducts.map(item => ({ ...item, type: 'sealed' }))
        ];

        setResults(combinedResults);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {query ? `Suchergebnisse für "${query}"` : 'Alle Produkte'}
          </h1>
          <Link href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
          >
            Zurück zur Startseite
          </Link>
        </div>
        {results.length === 0 ? (
          <p className="text-center">Keine Ergebnisse gefunden.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map(product => (
              <div key={`${product.type}-${product.id}`} className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:border-2">
                <Link href={`/${product.type}/${product.id}`} className="block">
                  <div className="relative pt-[100%]">
                    <Image 
                      src={product.main_image} 
                      alt={product.name} 
                      layout="fill" 
                      objectFit="contain" 
                      className="absolute top-0 left-0 w-full h-full p-2"
                    />
                  </div>
                  <div className="p-2 pb-4 absolute bottom-0 left-0 right-0 bg-white bg-opacity-80">
                    <h2 className="text-sm md:text-base font-semibold text-gray-800 truncate">{product.name}</h2>
                    <p className="text-sm text-gray-600 font-bold mt-1">{product.price.toFixed(2)} CHF</p>
                    <p className="text-xs text-gray-500 mt-1">{product.type === 'singles' ? 'Single' : 'Sealed Product'}</p>
                  </div>
                </Link>
                <button
                  onClick={() => addToCart(product, product.type)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    isInCart(product.id, product.type)
                      ? 'bg-gray-500'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                  disabled={isInCart(product.id, product.type)}
                >
                  {isInCart(product.id, product.type) ? '✓' : '+'}
                </button>
              </div>
            ))}
          </div>
        )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-4 mt-16">Laden...</div>}>
      <SearchResults />
    </Suspense>
  );
}
