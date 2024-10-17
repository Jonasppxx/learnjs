'use client';

import Link from 'next/link';

export default function Impressum() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Impressum</h1>
        <Link href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
        >
          Zurück zur Startseite
        </Link>
      </div>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Persönliche Angaben</h2>
        <p>Pokebuy</p>
        <p>Gantrischweg</p>
        <p>3123 Belp</p>
        <p>Schweiz</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Kontakt</h2>
        <p>Telefon: 079 308 19 99</p>
        <p>E-Mail: pokebuy@gmail.com</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Vertreten durch</h2>
        <p>Jonas Boos</p>
      </section>








    </div>
  );
}
