'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', main_image: '', secondary_image: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error('Error fetching products:', error);
    else setProducts(data);
  }

  async function addProduct(e) {
    e.preventDefault();
    const { data, error } = await supabase.from('products').insert([newProduct]);
    if (error) console.error('Error adding product:', error);
    else {
      setNewProduct({ name: '', description: '', price: '', main_image: '', secondary_image: '' });
      fetchProducts();
    }
  }

  async function removeProduct(id) {
    const { error } = await supabase.from('products').delete().match({ id });
    if (error) console.error('Error removing product:', error);
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
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <form onSubmit={addProduct} className="mb-8">
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Main Image URL"
          value={newProduct.main_image}
          onChange={(e) => setNewProduct({...newProduct, main_image: e.target.value})}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Secondary Image URL"
          value={newProduct.secondary_image}
          onChange={(e) => setNewProduct({...newProduct, secondary_image: e.target.value})}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: {product.price} CHF</p>
            <button 
              onClick={() => removeProduct(product.id)}
              className="bg-red-500 text-white p-2 rounded mt-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
