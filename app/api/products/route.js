import { NextResponse } from 'next/server';
import products from '../../../data/products.json';

export const runtime = 'edge';

export async function GET() {
  console.log('API-Route für Produkte aufgerufen');
  console.log('Produkte:', products);
  return NextResponse.json(products);
}
