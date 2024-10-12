'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Produkte laden
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fehler beim Laden der Produkte:', error);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
        setLoading(false);
      });

    // Warenkorb aus dem localStorage laden
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Warenkorb im localStorage speichern
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Produkte</h1>
      {loading ? (
        <p>Laden...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>{product.description}</p>
              <p className="font-bold mt-2">{product.price.toFixed(2)} €</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                disabled={cart.find(item => item.id === product.id)}
              >
                {cart.find(item => item.id === product.id) ? 'Im Warenkorb' : 'Zum Warenkorb hinzufügen'}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold my-8">Warenkorb</h2>
      {cart.length === 0 ? (
        <p>Ihr Warenkorb ist leer.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <span>{item.name} - {item.price.toFixed(2)} €</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Entfernen
              </button>
            </div>
          ))}
          <p className="font-bold mt-4">
            Gesamtsumme: {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)} €
          </p>
          <Link href="/checkout" className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Zur Kasse
          </Link>
        </div>
      )}
    </div>
  );
}
