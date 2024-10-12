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
        console.log('Geladene Produkte:', data);
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
    <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold my-8 text-gray-800">Produkte</h1>
      {loading ? (
        <p className="text-gray-600">Laden...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="font-bold mt-2 text-gray-800">{product.price.toFixed(2)} €</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                disabled={cart.find(item => item.id === product.id)}
              >
                {cart.find(item => item.id === product.id) ? 'Im Warenkorb' : 'Zum Warenkorb hinzufügen'}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold my-8 text-gray-800">Warenkorb</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Ihr Warenkorb ist leer.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">{item.price.toFixed(2)} €</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
          <p className="font-bold mt-6 text-lg text-gray-800">
            Gesamtsumme: {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)} €
          </p>
          <Link 
            href="/checkout" 
            className="inline-block mt-6 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition duration-300"
          >
            Zur Kasse
          </Link>
        </div>
      )}
    </div>
  );
}
