import { NextResponse } from 'next/server';

export async function POST(request) {
  const { cart } = await request.json();

  // Hier würden Sie normalerweise die Bestellung in Ihrer Datenbank speichern

  const order = {
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: cart.reduce((sum, item) => sum + item.price, 0).toFixed(2),
        },
      },
    ],
  };

  // Hier würden Sie die tatsächliche Verbindung zur PayPal-API herstellen
  // Dies ist nur ein Beispiel für die Struktur der Antwort
  const paypalOrderId = "MOCK_PAYPAL_ORDER_ID_" + Date.now();

  return NextResponse.json({ id: paypalOrderId });
}
