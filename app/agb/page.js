'use client';

import Link from 'next/link';

export default function AGB() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <Link href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
        >
          Zurück zur Startseite
        </Link>
      </div>
      
      {/* Der Rest des Inhalts bleibt unverändert */}
    </div>
  );
}
