import React from 'react';
import Link from 'next/link';
import Cart from './Cart'; // Importieren Sie die Cart-Komponente
import SearchBar from './SearchBar'; // Importieren Sie die SearchBar-Komponente

const Header = () => {
  return (
    <header className="p-4 sticky top-0 z-50 border-b border-gray-200"> {/* Leicht weiße Umrandung */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo auf der linken Seite */}
        <h1 className="text-xl font-bold flex items-center h-12">
          <Link href="/">Pokebuy</Link>
        </h1>

        {/* Container für die rechte Seite */}
        <div className="flex items-center space-x-4"> {/* Abstand zwischen den Elementen */}
          <div className="bg-gray-700 p-2 rounded h-12 flex items-center justify-center">
            <Link href="/checkout" className="text-white">Checkout</Link>
          </div>
          <div className="bg-gray-700 p-2 rounded h-12 flex items-center justify-center"> {/* Cart ohne blaue Umrandung */}
            <Cart />
          </div>
          <div className="bg-gray-700 p-2 rounded h-12 flex items-center justify-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;