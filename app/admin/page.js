'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [singles, setSingles] = useState([]);
  const [sealedProducts, setSealedProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    main_image: '',
    secondary_image: '',
    type: 'singles'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  async function fetchProducts() {
    const { data: singlesData, error: singlesError } = await supabase.from('singles').select('*');
    if (singlesError) console.error('Error fetching singles:', singlesError);
    else setSingles(singlesData);

    const { data: sealedData, error: sealedError } = await supabase.from('sealed_products').select('*');
    if (sealedError) console.error('Error fetching sealed products:', sealedError);
    else setSealedProducts(sealedData);
  }

  async function addProduct(e) {
    e.preventDefault();
    const { type, ...productData } = newProduct;
    const { data, error } = await supabase.from(type).insert([productData]);
    if (error) console.error(`Error adding ${type}:`, error);
    else {
      setNewProduct({ name: '', description: '', price: '', main_image: '', secondary_image: '', type: 'singles' });
      fetchProducts();
    }
  }

  async function removeProduct(id, type) {
    const { error } = await supabase.from(type).delete().match({ id });
    if (error) console.error(`Error removing ${type}:`, error);
    else fetchProducts();
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter admin password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <form onSubmit={addProduct} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Main Image URL"
            value={newProduct.main_image}
            onChange={(e) => setNewProduct({...newProduct, main_image: e.target.value})}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Secondary Image URL"
            value={newProduct.secondary_image}
            onChange={(e) => setNewProduct({...newProduct, secondary_image: e.target.value})}
            className="w-full border rounded p-2"
          />
          <select
            value={newProduct.type}
            onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
            className="w-full border rounded p-2"
          >
            <option value="singles">Singles</option>
            <option value="sealed_products">Sealed Products</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">Add Product</button>
      </form>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Singles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {singles.map(product => (
              <div key={product.id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-semibold mt-2">Price: {product.price} CHF</p>
                <button 
                  onClick={() => removeProduct(product.id, 'singles')}
                  className="bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Sealed Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sealedProducts.map(product => (
              <div key={product.id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-semibold mt-2">Price: {product.price} CHF</p>
                <button 
                  onClick={() => removeProduct(product.id, 'sealed_products')}
                  className="bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
