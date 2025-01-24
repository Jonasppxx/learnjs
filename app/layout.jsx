import './globals.css';
import { CartProvider } from './CartContext';
import CartOverlay from './components/CartOverlay';
import Footer from './components/Footer';
import Header from './components/Header'; // Header importieren

export const metadata = {
  title: 'Pokebuy - Ihr Online-Shop für Pokémon-Karten',
  description: 'Entdecken Sie eine große Auswahl an Pokémon-Karten und Booster Packs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3103292705962410"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <CartProvider>
          <CartOverlay />
          <Header /> {/* Header hier einfügen */}
          <main className="content-wrapper">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}