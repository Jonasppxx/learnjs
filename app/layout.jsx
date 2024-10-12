import './globals.css'

export const metadata = {
  title: 'Mein Online-Shop',
  description: 'Ein einfacher Online-Shop mit Next.js und Stripe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  )
}
