'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();
  const observer = useRef();
  const productObservers = useRef({});

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleProducts.length < products.length) {
        const newProducts = products.slice(visibleProducts.length, visibleProducts.length + 4);
        setVisibleProducts(prev => [...prev, ...newProducts]);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, products, visibleProducts]);

  const productElementRef = useCallback(node => {
    if (node) {
      const productObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.classList.add('animate-fade-in-up');
            productObserver.unobserve(node);
          }
        },
        { threshold: 0.1 }
      );
      productObserver.observe(node);
      productObservers.current[node.dataset.productId] = productObserver;
    }
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Geladene Produkte:', data);
        setProducts(data);
        setVisibleProducts(data.slice(0, 8)); // Lade initial 8 Produkte
        setLoading(false);
      })
      .catch(error => {
        console.error('Fehler beim Laden der Produkte:', error);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
        setLoading(false);
      });

    return () => {
      Object.values(productObservers.current).forEach(observer => observer.disconnect());
    };
  }, []);

  const isInCart = (productId) => cart.some(item => item.id === productId);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold my-8 text-gray-800">Produkte</h1>
        {loading ? (
          <p className="text-gray-600">Laden...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product, index) => (
              <div 
                key={product.id} 
                ref={node => {
                  productElementRef(node);
                  if (index === visibleProducts.length - 1) lastProductElementRef(node);
                }}
                data-product-id={product.id}
                className="flex flex-col p-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_0_1px_#3B82F6] opacity-0"
              >
                <Link href={`/product/${product.id}`} className="flex-grow">
                  <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg transition-opacity duration-300 opacity-0"
                      loading="lazy"
                      onLoadingComplete={(image) => {
                        image.classList.remove('opacity-0');
                        image.parentElement.querySelector('.animate-spin').classList.add('hidden');
                      }}
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-700 hover:text-blue-500 mb-2">{product.name}</h2>
                </Link>
                <p className="font-bold text-gray-800 mb-2">{product.price.toFixed(2)} CHF</p>
                <button
                  onClick={() => !isInCart(product.id) && addToCart(product)}
                  className={`w-full px-4 py-2 rounded transition duration-300 ${
                    isInCart(product.id)
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  disabled={isInCart(product.id)}
                >
                  {isInCart(product.id) ? 'In cart' : 'Add to cart'}
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
