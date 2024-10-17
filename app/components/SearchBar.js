'use client';

import React, { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Hier können Sie die Logik für die Suche implementieren
      console.log('Suchanfrage:', query);
      // Beispiel: Weiterleitung zur Suchseite mit der Abfrage
      if (query) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch} // Verwenden Sie onKeyDown, um die Enter-Taste zu erkennen
        placeholder="Suche nach Produkten..."
        className="w-full p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <style jsx>{`
        input {
          transition: background-color 0.3s ease;
        }
        input:focus {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
