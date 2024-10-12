import { NextResponse } from 'next/server';
import products from '../../../data/products.json';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(products);
}
