'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Importieren Sie das Lupe-Symbol

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Zustand für die Sichtbarkeit des Eingabefelds

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  return (
    <div className="relative w-full max-w-md flex items-center"> {/* Flex-Container für die Lupe und das Eingabefeld */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle für das Eingabefeld
        className={`flex items-center justify-center text-black transition-all duration-300 ${isOpen ? 'w-12' : 'w-10 h-10'}`} // Quadratische Form, wenn eingefahren
      >
        <FaSearch className="text-lg text-black" /> {/* Setzen Sie die Farbe des Icons auf schwarz */}
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="Suche nach Produkten..."
        className={`rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out ${isOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}`} // Breite und Opazität für den Übergang
        style={{ transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out' }} // Animation für Breite und Opazität
      />
    </div>
  );
};

export default SearchBar;