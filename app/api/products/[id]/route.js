import { NextResponse } from 'next/server';
import products from '../../../../data/products.json';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const product = products.find(p => p.id === parseInt(params.id));
  
  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
