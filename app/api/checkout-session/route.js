import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
