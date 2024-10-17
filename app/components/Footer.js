import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t pt-8 pb-4">
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
  );
}
