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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

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

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p className="text-center text-xl mt-24">Laden...</p>;
  if (error) return <p className="text-center text-xl mt-24 text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-xl mt-24">Produkt nicht gefunden</p>;

  const handleAddToCart = () => {
    if (!isInCart(product.id, 'singles')) {
      addToCart(product, 'singles');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Link href="/singles" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Zurück zu Singles
      </Link>
      <div className="md:flex md:space-x-8 mt-8">
        <div className="md:w-1/3 flex space-x-4">
          <div className="relative w-1/2 cursor-pointer" onClick={() => openModal(product.main_image)}>
            <Image
              src={product.main_image}
              alt={`${product.name} - Hauptbild`}
              layout="responsive"
              width={150}
              height={150}
              objectFit="contain"
              className="rounded-lg shadow-lg"
            />
          </div>
          {product.secondary_image && (
            <div className="relative w-1/2 cursor-pointer" onClick={() => openModal(product.secondary_image)}>
              <Image
                src={product.secondary_image}
                alt={`${product.name} - Zusätzliches Bild`}
                layout="responsive"
                width={150}
                height={150}
                objectFit="contain"
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} CHF</span>
            <button
              onClick={handleAddToCart}
              className={`px-6 py-3 ${isInCart(product.id, 'singles') ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300`}
              disabled={isInCart(product.id, 'singles')}
            >
              {isInCart(product.id, 'singles') ? 'Im Warenkorb' : 'In den Warenkorb'}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative w-full max-w-lg max-h-[80vh] overflow-auto">
            <Image
              src={modalImage}
              alt="Vergrößertes Bild"
              layout="responsive"
              width={800}
              height={800}
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
