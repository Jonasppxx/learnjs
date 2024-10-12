import './globals.css'
import { CartProvider } from './CartContext'
import Cart from './components/Cart'

export const metadata = {
  title: 'Mein Online-Shop',
  description: 'Ein einfacher Online-Shop mit Next.js und Stripe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">
        <CartProvider>
          <Cart />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
