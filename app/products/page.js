'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false })  // Ändern Sie 'id' zu einer vorhandenen Spalte
        .limit(100);
  
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Produkte:', error);
      setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id });

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Fehler beim Löschen des Produkts:', error);
      alert('Fehler beim Löschen des Produkts. Bitte versuchen Sie es erneut.');
    }
  };

  if (loading) return <div>Laden...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produkte</h1>
        <Link href="/add-product" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Neues Produkt hinzufügen
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md flex flex-col">
            {product.image && (
              <div className="relative w-full pt-[100%] mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg'; // Ersetzen Sie dies durch den Pfad zu einem Platzhalterbild
                  }}
                />
              </div>
            )}
            <h2 className="text-sm font-semibold mb-2 flex-grow">{product.name}</h2>
            <p className="text-sm font-bold mb-2">{product.price.toFixed(2)} CHF</p>
            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Löschen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}