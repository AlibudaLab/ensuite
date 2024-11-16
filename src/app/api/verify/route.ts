import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from 'src/service/vlayer';

export async function POST(req: NextRequest): Promise<Response> {
  const { ensAddress, emlProof } = await req.json();
  try {
    await verifyEmail(emlProof);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Failed to verify email' },
      { status: 400 },
    );
  }
  return NextResponse.json({ message: 'success' });
}
