import './globals.css'
import { CartProvider } from './CartContext'
import Header from './components/Header'

export const metadata = {
  title: 'Mein Online-Shop',
  description: 'Ein einfacher Online-Shop mit Next.js und Stripe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <CartProvider>
          <Header />
          <main className="content-wrapper">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
