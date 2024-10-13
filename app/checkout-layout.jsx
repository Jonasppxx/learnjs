import { CartProvider } from './CartContext'

export default function CheckoutLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <CartProvider>
          <main className="content-wrapper pt-4">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
