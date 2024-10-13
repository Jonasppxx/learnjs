'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [singles, setSingles] = useState([]);
  const [sealedProducts, setSealedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsPerRow, setProductsPerRow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerRow(1);
      } else if (window.innerWidth < 768) {
        setProductsPerRow(2);
      } else if (window.innerWidth < 1024) {
        setProductsPerRow(3);
      } else {
        setProductsPerRow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
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
        <h1 className="text-3xl font-bold my-8 text-gray-800">Willkommen bei Pokebuy</h1>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Singles</h2>
            <Link href="/singles" className="text-blue-500 hover:underline">
              Mehr anzeigen
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {singles.map(product => (
              <div key={product.id} className="group border border-transparent hover:border-blue-500 transition-all duration-300 p-2 rounded">
                <Link href={`/singles/${product.id}`} className="block">
                  <Image src={product.main_image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain mb-2" />
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600">{product.price.toFixed(2)} CHF</p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sealed Products</h2>
            <Link href="/sealed" className="text-blue-500 hover:underline">
              Mehr anzeigen
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sealedProducts.map(product => (
              <div key={product.id} className="group border border-transparent hover:border-blue-500 transition-all duration-300 p-2 rounded">
                <Link href={`/sealed/${product.id}`} className="block">
                  <Image src={product.main_image} alt={product.name} width={200} height={200} className="w-full h-48 object-contain mb-2" />
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600">{product.price.toFixed(2)} CHF</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
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
