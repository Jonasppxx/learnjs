'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          // Fetch singles
          const { data: singles, error: singlesError } = await supabase
            .from('singles')
            .select('*')
            .ilike('name', `%${query}%`)
            .or(`description.ilike.%${query}%`);

          if (singlesError) throw singlesError;

          // Fetch sealed products
          const { data: sealedProducts, error: sealedError } = await supabase
            .from('sealed_products')
            .select('*')
            .ilike('name', `%${query}%`)
            .or(`description.ilike.%${query}%`);

          if (sealedError) throw sealedError;

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
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) return <p className="text-center mt-8">Suche läuft...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {query && query.length > 1 ? `Suchergebnisse für "${query}"` : 'Alle Produkte'}
      </h1>
      {results.length === 0 ? (
        <p>Keine Ergebnisse gefunden.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <Link href={`/${product.type}/${product.id}`} key={`${product.type}-${product.id}`} className="block group border border-transparent hover:border-blue-500 transition-all duration-300 p-2 rounded">
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.main_image}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-700">{product.name}</h2>
                <p className="mt-1 text-lg font-medium text-gray-900">{product.price.toFixed(2)} CHF</p>
                <p className="mt-1 text-sm text-gray-500">{product.type === 'singles' ? 'Single' : 'Sealed Product'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <SearchResults />
    </Suspense>
  );
}
