import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export { client, publicClient };
