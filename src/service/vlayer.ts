import { TEST_EMAIL_BODY, VLAYER_PROVER, VLAYER_VERIFIER } from "src/constants";
import {Abi} from 'viem'
import { createVlayerClient, preverifyEmail } from "@vlayer/sdk";
import { getConfig, createContext } from "@vlayer/sdk/config";
import proverSpec from "../../contracts/out/EmailProver.sol/EmailProver.json";
import verifierSpec from "../../contracts/out/EmailProofVerifier.sol/EmailProofVerifier.json"

const verifyEmail = async () => {
    const preverifiedEmail = await preverifyEmail(TEST_EMAIL_BODY)
    const config = getConfig()
    const { chain, ethClient, account, proverUrl, confirmations } =
    await createContext(config);

    console.log('Proving...')

    const vlayer = createVlayerClient({
        url: proverUrl
    })
    const hash = await vlayer.prove({
        address: VLAYER_PROVER,
        proverAbi: proverSpec.abi as Abi,
        functionName: 'main',
        chainId: chain.id,
        args: [preverifiedEmail],
    })
    const result = await vlayer.waitForProvingResult(hash);
    const txHash = await ethClient.writeContract({
        address: VLAYER_VERIFIER,
        abi: verifierSpec.abi,
        functionName: 'verify',
        args: result as readonly unknown[],
        chain,
        account: account,
      });
    await ethClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations,
    retryCount: 60,
    retryDelay: 1000,
    });

    console.log('Verified!');
}

export {verifyEmail}