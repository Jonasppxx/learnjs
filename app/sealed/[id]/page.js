'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../CartContext';
import { supabase } from '../../../lib/supabase';

export default function SealedProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isInCart } = useCart();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sealed_products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Fehler beim Laden des Produkts. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!isInCart(product.id, 'sealed')) {
      addToCart(product, 'sealed');
    }
  };

  const handleImageClick = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) return <p className="text-center text-xl mt-24">Laden...</p>;
  if (error) return <p className="text-center text-xl mt-24 text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-xl mt-24">Produkt nicht gefunden</p>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Link href="/sealed" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Zurück zu Sealed Products
      </Link>
      <div className="flex flex-col md:flex-row md:space-x-8 mt-8">
        <div className="md:w-1/2 relative">
          <div className={`relative w-full h-96 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={handleImageClick}>
            <Image
              src={isFlipped ? product.secondary_image || product.main_image : product.main_image}
              alt={`${product.name} - Bild`}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          {/* Entferne das "Click me"-Bild */}
          {/* <div className="absolute bottom-[-20px] right-[-20px]">
            <Image
              src="/images/click_me.jpg"
              alt="Click me"
              width={70} // Größeres Bild
              height={70}
              className="rounded-full"
            />
          </div> */}
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <span className="text-2xl font-bold text-gray-900 mb-4 block">{product.price.toFixed(2)} CHF</span>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <button
            onClick={handleAddToCart}
            className={`px-6 py-3 ${isInCart(product.id, 'sealed') ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300`}
            disabled={isInCart(product.id, 'sealed')}
          >
            {isInCart(product.id, 'sealed') ? 'Im Warenkorb' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
    </div>
  );
}
