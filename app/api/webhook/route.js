import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Hier können Sie die Bestellbestätigung per E-Mail senden
    // Für dieses Beispiel verwenden wir console.log
    console.log(`Bestellung bestätigt für ${session.customer_details.email}`);
  }

  return NextResponse.json({ received: true });
}
