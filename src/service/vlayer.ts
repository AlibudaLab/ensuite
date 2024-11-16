import { VLAYER_PROVER, VLAYER_VERIFIER } from 'src/constants';
import { Abi } from 'viem';
import { createVlayerClient, preverifyEmail } from '@vlayer/sdk';
import { getConfig, createContext } from '@vlayer/sdk/config';
import proverSpec from '../../contracts/out/EmailProver.sol/EmailProver.json';

const generateEmailProof = async (emlProof: string) => {
  const preverifiedEmail = await preverifyEmail(emlProof);
  const config = getConfig();
  const { chain, ethClient, account, proverUrl, confirmations } =
    await createContext(config);

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
