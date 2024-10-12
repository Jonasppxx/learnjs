'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYou() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return <div>Laden...</div>;
  }

  if (!order) {
    return <div>Keine Bestelldetails gefunden.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Vielen Dank für Ihre Bestellung!</h1>
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
        <p className="font-bold">Bestellung erfolgreich abgeschlossen</p>
        <p>Ihre Transaktions-ID: {order.id}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">Bestellübersicht</h2>
      {order.line_items.data.map((item, index) => (
        <div key={index} className="flex justify-between items-center border-b py-2">
          <span>{item.description}</span>
          <span>{(item.amount_total / 100).toFixed(2)} CHF</span>
        </div>
      ))}
      <p className="font-bold mt-4">
        Gesamtsumme: {(order.amount_total / 100).toFixed(2)} CHF
      </p>
      <Link href="/" className="inline-block mt-8 bg-blue-500 text-white px-4 py-2 rounded">
        Zurück zur Startseite
      </Link>
    </div>
  );
}
