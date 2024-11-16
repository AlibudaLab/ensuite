import { NextRequest, NextResponse } from 'next/server';
import { privateKeyToAccount } from 'viem/accounts';
import { client, publicClient } from '../../../web3/viem';
import ensRegisterSpec from '../../../web3/contracts/ENSRegister.json';
import { ENS_REGISTER } from '../../../constants';

const ENSUITE_ADMIN_KEY = process.env.ENSUITE_ADMIN_KEY as string;

export async function POST(req: NextRequest): Promise<Response> {
  const { ensName, ensAddress } = await req.json();

  console.log(ensName, ensAddress);
  try {
    const account = privateKeyToAccount(ENSUITE_ADMIN_KEY as `0x${string}`);
    const tx = await client.writeContract({
      address: ENS_REGISTER,
      abi: ensRegisterSpec.abi,
      functionName: 'registerByAdmin',
      args: [ensName, ensAddress],
      account,
    });
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });
    if (transaction.status !== 'success') {
      return NextResponse.json(
        { message: 'Failed to register ENS' },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: 'success' });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Failed to register ENS' },
      { status: 400 },
    );
  }
}
