'use client';

import { useCart } from '../CartContext';
import Link from 'next/link';

export default function Cart() {
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold">Warenkorb</h1>
      {cart.length === 0 ? (
        <p>Ihr Warenkorb ist leer.</p>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.id} className="flex justify-between items-center border-b py-2">
              <span>{item.name}</span>
              <span>{item.price.toFixed(2)} CHF</span>
            </li>
          ))}
        </ul>
      )}
      <Link href="/" className="mt-4 inline-block text-blue-500">Zurück zum Shop</Link>
    </div>
  );
}
