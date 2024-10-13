'use client';

import { useState, useEffect } from 'react';
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
  const [featuredCard, setFeaturedCard] = useState(null);
  const [expensiveCard, setExpensiveCard] = useState(null);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setProductsPerRow(1);
      else if (window.innerWidth < 768) setProductsPerRow(2);
      else if (window.innerWidth < 1024) setProductsPerRow(3);
      else setProductsPerRow(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        
        // Fetch singles
        const { data: singlesData, error: singlesError } = await supabase
          .from('singles')
          .select('*')
          .order('id', { ascending: true })
          .limit(productsPerRow);

        if (singlesError) throw singlesError;
        setSingles(singlesData);

        // Fetch sealed products
        const { data: sealedData, error: sealedError } = await supabase
          .from('sealed_products')
          .select('*')
          .order('id', { ascending: true })
          .limit(productsPerRow);

        if (sealedError) throw sealedError;
        setSealedProducts(sealedData);

        // Fetch a random product for the featured card
        const { data: allProducts, error: allProductsError } = await supabase
          .from('singles')
          .select('*')
          .limit(100);

        if (allProductsError) throw allProductsError;

        const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
        const randomQuote = pokemonQuotes[Math.floor(Math.random() * pokemonQuotes.length)];
        
        setFeaturedCard({
          ...randomProduct,
          quote: randomQuote,
          properties: cardProperties.reduce((acc, prop) => {
            acc[prop] = Math.floor(Math.random() * 100);
            return acc;
          }, {})
        });

        // Fetch the most expensive card
        const { data: expensiveData, error: expensiveError } = await supabase
          .from('singles')
          .select('*')
          .order('price', { ascending: false })
          .limit(1)
          .single();

        if (expensiveError) throw expensiveError;
        setExpensiveCard(expensiveData);

      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productsPerRow]);

  if (loading) return <p className="text-center text-xl mt-8">Laden...</p>;
  if (error) return <p className="text-center text-xl mt-8 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-16"></div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold transition-opacity duration-500">
            {welcomeMessages[welcomeIndex].split(' ').map((word, index) => (
              <span key={index} className={index === welcomeMessages[welcomeIndex].split(' ').length - 1 ? "bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
        </div>
        
        {featuredCard && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <Image 
                  src={featuredCard.main_image} 
                  alt={featuredCard.name} 
                  width={200} 
                  height={200} 
                  className="rounded-lg mx-auto"
                  objectFit="contain"
                />
              </div>
              <div className="w-full md:w-2/3 md:pl-6 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{featuredCard.name}</h2>
                <p className="text-lg italic mb-4">"{featuredCard.quote}"</p>
                <p className="mb-4">{featuredCard.description}</p>
                <p className="text-xl font-bold mb-4">{featuredCard.price.toFixed(2)} CHF</p>
                <Link href={`/singles/${featuredCard.id}`} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded transition duration-300">
                  Produkt ansehen
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <ProductSection title="Singles" products={singles} type="singles" addToCart={addToCart} isInCart={isInCart} />
        <ProductSection title="Sealed Products" products={sealedProducts} type="sealed" addToCart={addToCart} isInCart={isInCart} />

        {expensiveCard && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Unsere Empfehlung</h2>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <div className="relative w-48 h-64 mx-auto perspective-1000">
                    <div className="w-full h-full transition-transform duration-300 transform-style-3d hover:rotate-y-10 hover:scale-105">
                      <Image 
                        src={expensiveCard.main_image} 
                        alt={expensiveCard.name} 
                        layout="fill" 
                        objectFit="contain" 
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:pl-6 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">{expensiveCard.name}</h3>
                  <p className="mb-4">{expensiveCard.description}</p>
                  <p className="text-xl font-bold mb-4">{expensiveCard.price.toFixed(2)} CHF</p>
                  <Link href={`/singles/${expensiveCard.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                    Produkt ansehen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Ricardo Link */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <a 
            href="https://www.ricardo.ch/de/shop/J0B0/offers/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 transition duration-300"
          >
            <Image 
              src="/logo.png" 
              alt="Pokebuy Logo" 
              width={40} 
              height={40} 
              className="mr-3"
            />
            <span className="text-lg font-semibold mx-3">Besuchen Sie unseren Ricardo-Shop</span>
            <Image 
              src="/ricardo-logo.png" 
              alt="Ricardo Logo" 
              width={40} 
              height={40} 
              className="ml-3"
            />
          </a>
        </div>
      </div>

      <footer className="border-t pt-8 pb-4">
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

function ProductSection({ title, products, type, addToCart, isInCart }) {
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
          {products.map(product => (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:border-2">
              <Link href={`/${type}/${product.id}`} className="block">
                <div className="relative pt-[100%]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <Image 
                    src={product.main_image} 
                    alt={product.name} 
                    layout="fill" 
                    objectFit="contain" 
                    className="absolute top-0 left-0 w-full h-full p-2"
                    onLoadingComplete={(img) => {
                      img.style.opacity = 1;
                      img.previousElementSibling.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-2 pb-4 absolute bottom-0 left-0 right-0 bg-white bg-opacity-80">
                  <h2 className="text-sm md:text-base font-semibold text-gray-800 truncate">{product.name}</h2>
                  <p className="text-sm text-gray-600 font-bold mt-1">{product.price.toFixed(2)} CHF</p>
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