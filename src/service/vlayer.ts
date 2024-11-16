import { VLAYER_PROVER } from 'src/constants';
import type { Abi } from 'viem';
import { createVlayerClient, preverifyEmail } from '@vlayer/sdk';
import { getConfig, createContext } from '@vlayer/sdk/config';
import proverSpec from '../web3/contracts/EmailProver.json';

const generateEmailProof = async (emlProof: string) => {
  const preverifiedEmail = await preverifyEmail(emlProof);
  const config = getConfig();
  const { chain, proverUrl } = await createContext(config);

  const vlayer = createVlayerClient({
    url: proverUrl,
  });
  const hash = await vlayer.prove({
    address: VLAYER_PROVER,
    proverAbi: proverSpec.abi as Abi,
    functionName: 'main',
    chainId: chain.id,
    args: [preverifiedEmail],
  });
  const result = await vlayer.waitForProvingResult(hash);
  return result;
};

export { generateEmailProof };
