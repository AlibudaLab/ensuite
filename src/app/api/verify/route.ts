import { verify } from 'crypto';
import { NextResponse } from 'next/server';
import { verifyEmail } from 'src/service/vlayer';

export async function GET() {
  await verifyEmail();
  return NextResponse.json({ message: 'Hello, World!' });
}