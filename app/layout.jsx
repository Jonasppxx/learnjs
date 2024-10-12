import './globals.css'

export const metadata = {
  title: 'Mein Online-Shop',
  description: 'Ein einfacher Online-Shop mit Next.js und PayPal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <script src="https://www.paypal.com/sdk/js?client-id=AW13j03ky2ZRe4HMVYdl_J4JdASY2Bmf9RUpMl30NDuFYf91hsv4Yfu0dumLWSL9NNy8ma6jU4fAZOD0&currency=EUR"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
