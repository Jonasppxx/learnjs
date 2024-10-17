import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Pokebuy</Link>
        </h1>
        <nav>
          <Link href="/checkout" className="mr-4">Checkout</Link>
          <Link href="/cart">Warenkorb</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
