'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function PriceComparison() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchItems();
  }, [sortField, sortOrder]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pokemon_price_comparison')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) throw error;
      setItems(data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
      setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHidden = async (id, currentHiddenState) => {
    try {
      const { data, error } = await supabase
        .from('pokemon_price_comparison')
        .update({ hiden: !currentHiddenState })
        .eq('id', id);

      if (error) throw error;
      
      setItems(items.map(item => 
        item.id === id ? { ...item, hiden: !currentHiddenState } : item
      ));
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Elements:', error);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const openAllLinks = () => {
    getCurrentPageItems().forEach(item => {
      window.open(item.original_link, '_blank');
      window.open(item.found_link, '_blank');
    });
  };

  const getCurrentPageItems = () => {
    const visibleItems = items.filter(item => !item.hiden);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return visibleItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const pageCount = Math.ceil(items.filter(item => !item.hiden).length / itemsPerPage);

  if (loading) return <div className="container mx-auto px-4 py-8">Laden...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">{error}</div>;

  const hiddenItems = items.filter(item => item.hiden);

  const renderTable = (items, isHidden) => (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('original_price')}>
            Originalpreis {sortField === 'original_price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('found_price')}>
            Gefundener Preis {sortField === 'found_price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('absolute_difference')}>
            Absolute Differenz {sortField === 'absolute_difference' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th className="px-4 py-2 border-b">Aktion</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td className="px-4 py-2 border-b">
              <a href={item.original_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {item.original_price.toFixed(2)} CHF
              </a>
            </td>
            <td className="px-4 py-2 border-b">
              <a href={item.found_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {item.found_price.toFixed(2)} CHF
              </a>
            </td>
            <td className="px-4 py-2 border-b">{item.absolute_difference.toFixed(2)} CHF</td>
            <td className="px-4 py-2 border-b">
              <button 
                onClick={() => toggleHidden(item.id, isHidden)}
                className={`${isHidden ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-1 px-2 rounded`}
              >
                {isHidden ? 'Einblenden' : 'Ausblenden'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Preisvergleich</h1>
      <div className="mb-4">
        <label htmlFor="itemsPerPage" className="mr-2">Elemente pro Seite:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded p-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button
          onClick={openAllLinks}
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Alle sichtbaren Links öffnen
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Sichtbare Elemente</h2>
      {renderTable(getCurrentPageItems(), false)}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          Vorherige
        </button>
        <span>Seite {currentPage} von {pageCount}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Nächste
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Ausgeblendete Elemente</h2>
      {renderTable(hiddenItems, true)}
    </div>
  );
}