'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { useCart } from './CartContext';

const pokemonQuotes = [
  "Ich wähle dich!",
  "Schnapp sie dir alle!",
  "Entwickle dich weiter!",
  "Werde der allerbeste!",
  "Träume groß, trainiere hart!",
];

const cardProperties = [
  "Seltenheit", "Angriffsstärke", "Verteidigung", "Spezialfähigkeit", "Sammlerwert"
];

export default function Home() {
  const [singles, setSingles] = useState([]);
  const [sealedProducts, setSealedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const welcomeMessages = [
    "Willkommen bei Pokebuy",
    "ようこそ Pokebuy", // Japanisch
    "Welcome to Pokebuy",
    "Bienvenue à Pokebuy",
    "Bienvenido a Pokebuy",
  ];

  const { addToCart, isInCart } = useCart();

  const handleResize = useCallback(() => {
    if (window.innerWidth < 640) setProductsPerRow(1);
    else if (window.innerWidth < 768) setProductsPerRow(2);
    else if (window.innerWidth < 1024) setProductsPerRow(3);
    else setProductsPerRow(4);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeIndex((prevIndex) => (prevIndex + 1) % welcomeMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const { data: singlesData, error: singlesError } = await supabase
          .from('singles')
          .select('*')
          .order('id', { ascending: true })
          .limit(productsPerRow);

        if (singlesError) throw singlesError;
        setSingles(singlesData);

        const { data: sealedData, error: sealedError } = await supabase
          .from('sealed_products')
          .select('*')
          .order('id', { ascending: true })
          .limit(productsPerRow);

        if (sealedError) throw sealedError;
        setSealedProducts(sealedData);

      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productsPerRow]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-screen"> {/* Höhe des Containers verringern */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center transition-opacity duration-500">
              {welcomeMessages[welcomeIndex].split(' ').map((word, index) => (
                <span key={index} className={index === welcomeMessages[welcomeIndex].split(' ').length - 1 ? "bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <ProductSection title="Singles" products={singles} type="singles" addToCart={addToCart} isInCart={isInCart} isLoading={loading} />
          <ProductSection title="Sealed Products" products={sealedProducts} type="sealed" addToCart={addToCart} isInCart={isInCart} isLoading={loading} />
          
          {/* Blog Section */}
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Entdecke spannende Rankings</h2>
              <p className="text-gray-600 mb-6">
                Tauche ein in faszinierende Top-Listen und Rankings: Von den wertvollsten Gemälden der Welt 
                bis zu den seltensten Pokémon-Karten aller Zeiten. Erfahre mehr auf unserem Blog!
              </p>
              <div className="space-y-2 mb-6 text-left">
                <p className="text-gray-700">• Top 10 wertvollste Gemälde der Geschichte</p>
                <p className="text-gray-700">• Die seltensten Pokémon-Karten weltweit</p>
                <p className="text-gray-700">• Interessante Sammlerstücke und ihre Geschichte</p>
              </div>
              <a 
                href="https://numera.blog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                Zum Blog
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProductSection({ title, products, type, addToCart, isInCart, isLoading }) {
  const productRefs = useRef([]);

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

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link 
          href={`/${type}`} 
          className="group flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          <span className="mr-2">Mehr anzeigen</span>
          <span className="text-xl transform transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-2xl font-bold text-gray-600">Coming Soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              ref={el => productRefs.current[index] = el}
              className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-blue-500 animate-fade-in"
            >
              <Link href={`/${type}/${product.id}`} className="block">
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
                onClick={() => addToCart(product, type)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isInCart(product.id, type)
                    ? 'bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                disabled={isInCart(product.id, type)}
              >
                {isInCart(product.id, type) ? '✓' : '+'}
              </button>
            </div>
          ))} 
        </div>
      )}
    </section>
  );
}