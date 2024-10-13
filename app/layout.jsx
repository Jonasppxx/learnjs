import './globals.css'
import { CartProvider } from './CartContext'
import Header from './components/Header'

export const metadata = {
  title: 'Pokebuy - Ihr Online-Shop für Pokémon-Karten',
  description: 'Entdecken Sie eine große Auswahl an Pokémon-Karten und Booster Packs. Kaufen Sie die neuesten Editionen und seltene Karten in unserem sicheren und benutzerfreundlichen Online-Shop.',
  keywords: 'Pokémon, Karten, Booster Packs, Trading Cards, Sammelkarten, Online-Shop',
  author: 'Pokebuy Team',
  openGraph: {
    title: 'Pokebuy - Pokémon-Karten Online-Shop',
    description: 'Entdecken Sie seltene Pokémon-Karten und die neuesten Booster Packs in unserem Shop.',
    type: 'website',
    url: 'https://www.pokebuy.ch', // Ersetzen Sie dies durch Ihre tatsächliche URL
    image: 'https://www.pokebuy.ch/images/og-image.jpg', // Ersetzen Sie dies durch den Pfad zu Ihrem tatsächlichen Bild
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokebuy - Pokémon-Karten Shop',
    description: 'Finden Sie Ihre Lieblings-Pokémon-Karten bei uns!',
    image: 'https://www.pokebuy.ch/images/twitter-image.jpg', // Ersetzen Sie dies durch den Pfad zu Ihrem tatsächlichen Bild
  },
  robots: 'index, follow',
  canonical: 'https://www.pokebuy.ch', // Ersetzen Sie dies durch Ihre tatsächliche URL
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <CartProvider>
          <Header />
          <main className="content-wrapper pt-4">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
