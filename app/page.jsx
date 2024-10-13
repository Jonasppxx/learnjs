'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart, isOpen } = useCart();
  const observer = useRef();
  const productRefs = useRef({});

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleProducts.length < products.length) {
        setVisibleProducts(prev => [...prev, products[prev.length]]);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, products, visibleProducts]);

  const productElementRef = useCallback(node => {
    if (node) {
      const productObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
            productObserver.unobserve(node);
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
      productObserver.observe(node);
      productRefs.current[node.dataset.productId] = productObserver;
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched products:', data);
        setProducts(data);
        setVisibleProducts(data.slice(0, 8)); // Lade initial 8 Produkte
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      Object.values(productRefs.current).forEach(observer => observer.disconnect());
    };
  }, []);

  const isInCart = (productId) => cart.some(item => item.id === productId);

  const handleProductClick = (e) => {
    if (isOpen) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold my-8 text-gray-800">Produkte</h1>
        {loading ? (
          <div className="h-[calc(100vh-300px)]"></div> // Platzhalter für Ladezeit
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
                className="flex flex-col p-2 rounded-lg transition-all duration-500 ease-out hover:shadow-[0_0_0_1px_#3B82F6] h-full"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                }}
              >
                <Link 
                  href={`/product/${product.id}`} 
                  className="flex flex-col flex-grow"
                  onClick={handleProductClick}
                >
                  <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <Image
                      src={product.main_image}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                      priority
                      loading="eager"
                      onLoadingComplete={(img) => {
                        img.style.opacity = 1;
                        img.previousSibling.style.display = 'none';
                      }}
                      style={{ opacity: 0, transition: 'opacity 0.3s' }}
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-700 hover:text-blue-500 mb-2">{product.name}</h2>
                </Link>
                <div className="mt-auto">
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
