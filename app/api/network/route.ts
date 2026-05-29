import { NextResponse } from 'next/server';
import { network } from '@/lib/data';

export async function GET() {
  return NextResponse.json(network);
}
