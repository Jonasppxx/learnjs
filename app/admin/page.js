'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CSVLink } from "react-csv";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([{ name: '', description: '', price: '', main_image: '', secondary_image: '', type: 'singles' }]);
  const [editMode, setEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  async function fetchProducts() {
    const { data: singlesData, error: singlesError } = await supabase.from('singles').select('*');
    const { data: sealedData, error: sealedError } = await supabase.from('sealed_products').select('*');
    
    if (singlesError) console.error('Error fetching singles:', singlesError);
    if (sealedError) console.error('Error fetching sealed products:', sealedError);
    
    setProducts([...singlesData, ...sealedData]);
  }

  async function addProducts() {
    for (let product of newProducts) {
      const { type, ...productData } = product;
      // Konvertiere den Preis in eine Zahl
      productData.price = parseFloat(productData.price);
      const { data, error } = await supabase.from(type).insert([productData]);
      if (error) console.error(`Error adding ${type}:`, error);
    }
    setNewProducts([{ name: '', description: '', price: '', main_image: '', secondary_image: '', type: 'singles' }]);
    fetchProducts();
  }

  async function updateProducts() {
    for (let product of products) {
      const { type, ...productData } = product;
      const { error } = await supabase.from(type).update(productData).match({ id: product.id });
      if (error) console.error(`Error updating ${type}:`, error);
    }
    setEditMode(false);
    fetchProducts();
  }

  async function removeSelectedProducts() {
    for (let productId of selectedProducts) {
      const product = products.find(p => p.id === productId);
      const { error } = await supabase.from(product.type).delete().match({ id: product.id });
      if (error) console.error(`Error removing ${product.type}:`, error);
    }
    setSelectedProducts([]);
    fetchProducts();
  }

  function handleProductChange(index, field, value) {
    const updatedProducts = [...newProducts];
    updatedProducts[index][field] = value;
    setNewProducts(updatedProducts);
  }

  function handleExistingProductChange(index, field, value) {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      const headers = lines[0].split(',');
      const newProducts = lines.slice(1).map(line => {
        const values = line.split(',');
        const product = {};
        headers.forEach((header, index) => {
          product[header.trim()] = values[index] ? values[index].trim() : '';
        });
        return product;
      });
      setNewProducts(newProducts);
    };
    reader.readAsText(file);
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
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Products</h2>
        <input type="file" onChange={handleFileUpload} accept=".csv" className="mb-4" />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Main Image</th>
                <th className="px-4 py-2">Secondary Image</th>
                <th className="px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {newProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={product.main_image}
                      onChange={(e) => handleProductChange(index, 'main_image', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={product.secondary_image}
                      onChange={(e) => handleProductChange(index, 'secondary_image', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={product.type}
                      onChange={(e) => handleProductChange(index, 'type', e.target.value)}
                      className="w-full"
                    >
                      <option value="singles">Singles</option>
                      <option value="sealed_products">Sealed Products</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addProducts} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">Add Products</button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
        <div className="flex justify-between mb-4">
          <button onClick={() => setEditMode(!editMode)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors">
            {editMode ? 'Cancel Edit' : 'Edit Products'}
          </button>
          {editMode && (
            <button onClick={updateProducts} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors">
              Save Changes
            </button>
          )}
          <button onClick={removeSelectedProducts} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors">
            Remove Selected
          </button>
          <CSVLink data={products} filename={"products.csv"} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors">
            Export to CSV
          </CSVLink>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Main Image</th>
                <th className="px-4 py-2">Secondary Image</th>
                <th className="px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleExistingProductChange(index, 'name', e.target.value)}
                        className="w-full"
                      />
                    ) : product.name}
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={product.description}
                        onChange={(e) => handleExistingProductChange(index, 'description', e.target.value)}
                        className="w-full"
                      />
                    ) : product.description}
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleExistingProductChange(index, 'price', e.target.value)}
                        className="w-full"
                      />
                    ) : `${product.price} CHF`}
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={product.main_image}
                        onChange={(e) => handleExistingProductChange(index, 'main_image', e.target.value)}
                        className="w-full"
                      />
                    ) : product.main_image}
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={product.secondary_image}
                        onChange={(e) => handleExistingProductChange(index, 'secondary_image', e.target.value)}
                        className="w-full"
                      />
                    ) : product.secondary_image}
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <select
                        value={product.type}
                        onChange={(e) => handleExistingProductChange(index, 'type', e.target.value)}
                        className="w-full"
                      >
                        <option value="singles">Singles</option>
                        <option value="sealed_products">Sealed Products</option>
                      </select>
                    ) : product.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}