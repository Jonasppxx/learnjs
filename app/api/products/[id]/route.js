import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export const runtime = 'edge';

export async function GET(request, { params }) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
