import { type NextRequest, NextResponse } from 'next/server';
import { generateEmailProof } from 'src/service/vlayer';

export async function POST(req: NextRequest): Promise<Response> {
  const { emlProof } = await req.json();
  try {
    const proof = await generateEmailProof(emlProof);
    console.log(proof);
    return NextResponse.json({ data: proof });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Failed to verify email' },
      { status: 400 },
    );
  }
}
