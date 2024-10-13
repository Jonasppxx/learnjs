'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold my-8 text-gray-800">Willkommen bei Pokebuy</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/singles" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl transition duration-300">
            Singles
          </Link>
          <Link href="/sealed" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl transition duration-300">
            Sealed Products
          </Link>
        </div>
      </div>
      
      <footer className="mt-auto border-t pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8">
            <Link href="/datenschutz" className="text-blue-500 hover:underline">Datenschutzerklärung</Link>
            <Link href="/agb" className="text-blue-500 hover:underline">AGB</Link>
            <Link href="/impressum" className="text-blue-500 hover:underline">Impressum</Link>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2024 Pokebuy. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
