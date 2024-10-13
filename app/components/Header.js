import Image from 'next/image';
import Cart from './Cart';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={60} height={24} className="opacity-80" />
        </Link>
        <SearchBar />
        <Cart />
      </div>
    </header>
  );
}