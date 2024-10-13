'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../CartContext';
import { supabase } from '../../lib/supabase';

export default function SealedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isInCart } = useCart();

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

  if (loading) return <p>Laden...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sealed Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <Link href={`/sealed/${product.id}`}>
              <Image src={product.main_image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain mb-4" />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            </Link>
            <p className="text-gray-600 mb-2">{product.price.toFixed(2)} CHF</p>
            <button
              onClick={() => addToCart(product, 'sealed')}
              className={`w-full px-4 py-2 rounded ${
                isInCart(product.id, 'sealed')
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isInCart(product.id, 'sealed')}
            >
              {isInCart(product.id, 'sealed') ? 'Im Warenkorb' : 'In den Warenkorb'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
