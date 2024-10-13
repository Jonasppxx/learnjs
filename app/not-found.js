'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <Image
          src="/images/confused_pikachu.png"  // Stellen Sie sicher, dass Sie dieses Bild haben oder ersetzen Sie es durch ein anderes passendes Bild
          alt="Verwirrter Pikachu"
          width={200}
          height={200}
          className="mb-8"
        />
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Oops! Diese Seite wurde nicht gefangen!</h2>
        <p className="text-xl text-gray-600 mb-8">
          Es sieht so aus, als wäre diese Pokémon-Karte in der wilden Natur verschwunden.
        </p>
        <Link href="/" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
