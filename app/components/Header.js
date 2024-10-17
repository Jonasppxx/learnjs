import React from 'react';
import Link from 'next/link';
import Cart from './Cart'; // Importieren Sie die Cart-Komponente
import SearchBar from './SearchBar'; // Importieren Sie die SearchBar-Komponente

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md"> {/* Sticky Header */}
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Pokebuy</Link>
        </h1>
        <nav className="flex-grow flex justify-center"> {/* Flexbox für zentrierte Navigation */}
          <SearchBar /> {/* Hier wird die Suchleiste eingebunden */}
        </nav>
        <nav className="flex items-center">
          <Link href="/checkout" className="mr-4">Checkout</Link>
          <Cart /> {/* Hier wird die Cart-Komponente eingebunden */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
