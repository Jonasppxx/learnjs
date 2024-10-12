'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const OrderDetails = dynamic(() => import('./OrderDetails'), {
  ssr: false,
  loading: () => <div>Laden...</div>
});

export default function ThankYou() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Vielen Dank für Ihre Bestellung!</h1>
      <Suspense fallback={<div>Laden...</div>}>
        <OrderDetails />
      </Suspense>
      <Link href="/" className="inline-block mt-8 bg-blue-500 text-white px-4 py-2 rounded">
        Zurück zur Startseite
      </Link>
    </div>
  );
}
