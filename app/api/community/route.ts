import { NextResponse } from 'next/server';
import { community } from '@/lib/data';

export async function GET() {
  return NextResponse.json(community);
}
