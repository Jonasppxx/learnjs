import React from 'react';
import Link from 'next/link';
import Cart from './Cart'; // Importieren Sie die Cart-Komponente
import SearchBar from './SearchBar'; // Importieren Sie die SearchBar-Komponente

const Header = () => {
  return (
    <header className="p-4 sticky top-0 z-50 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo auf der linken Seite */}
        <h1 className="text-xl font-bold flex items-center h-12">
          <Link href="/">Pokebuy</Link>
        </h1>

        {/* Container für die rechte Seite mit einer äußeren weißen Box */}
        <div className="p-1 border border-white bg-white rounded-md flex items-center space-x-4"> {/* Dünne weiße Umrandung und weiße Hintergrundfarbe */}
          <div className="p-2 text-black rounded-md h-12 flex items-center justify-center"> {/* Rechteckige Box für die Suchleiste */}
            <SearchBar /> {/* Suchfeld ganz links */}
          </div>
          <div className="p-2 text-black rounded-md h-12 flex items-center justify-center"> {/* Rechteckige Box für den Checkout-Link */}
            <Link href="/checkout" className="text-gray-800">Checkout</Link>
          </div>
          <div className="p-2 text-black rounded-md h-12 flex items-center justify-center"> {/* Rechteckige Box für den Warenkorb */}
            <Cart />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;