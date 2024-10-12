'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch('/api/products')
        .then(res => res.json())
        .then(products => {
          const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filteredProducts);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          setLoading(false);
        });
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
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-700">{product.name}</h2>
                <p className="mt-1 text-lg font-medium text-gray-900">{product.price.toFixed(2)} CHF</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
