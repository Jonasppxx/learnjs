'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';

const OrderDetails = dynamic(() => import('./OrderDetails'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>
});

export default function ThankYou() {
  return (
    <>
      <Header hideSearch={true} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Vielen Dank für Ihre Bestellung!</h1>
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/thank-you-pokemon.png"
              alt="Dankeschön Pokémon"
              width={200}
              height={200}
            />
          </div>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>}>
            <OrderDetails />
          </Suspense>
          <div className="mt-8 text-center">
            <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 hover:bg-blue-700">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
