'use client'

import Safe, {
    PredictedSafeProps,
    SafeAccountConfig,
} from '@safe-global/protocol-kit'
import { baseSepolia } from 'viem/chains'
import { 
    useAccount, 
    usePublicClient, 
    useWalletClient,
} from 'wagmi'
import { useState } from 'react'

export const DeployVault = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [deployedSafeAddress, setDeployedSafeAddress] = useState<string>('');

    const { address: userAddress } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const createSafeAccount = async () => {
        if (!walletClient || !userAddress) {
            setError('Wallet not connected');
            return;
        }

        setLoading(true);
        try {
            console.log('Starting Safe deployment...');
            console.log('User address:', userAddress);

            const safeAccountConfig: SafeAccountConfig = {
                owners: [userAddress],
                threshold: 1
            }
            
            const predictedSafe: PredictedSafeProps = {
                safeAccountConfig
            }
            
            const protocolKit = await Safe.init({
                provider: baseSepolia.rpcUrls.default.http[0],
                signer: walletClient as any,
                predictedSafe
            })

            const initialSafeAddress = await protocolKit.getAddress()
            console.log('Initial Safe address:', initialSafeAddress);

            const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()

            const transactionHash = await walletClient.sendTransaction({
                to: deploymentTransaction.to,
                value: BigInt(deploymentTransaction.value),
                data: deploymentTransaction.data as `0x${string}`,
                chain: baseSepolia
            })

            console.log('Deployment transaction hash:', transactionHash);

            const transactionReceipt = await publicClient?.waitForTransactionReceipt({
                hash: transactionHash
            })

            const newProtocolKit = await protocolKit.connect({
                safeAddress: initialSafeAddress
            })
            
            const isSafeDeployed = await newProtocolKit.isSafeDeployed()
            const safeAddress = await newProtocolKit.getAddress()
            const safeOwners = await newProtocolKit.getOwners()
            const safeThreshold = await newProtocolKit.getThreshold()

            console.log('Safe deployed:', {
                isSafeDeployed,
                safeAddress,
                safeOwners,
                safeThreshold
            });

            setDeployedSafeAddress(safeAddress);

        } catch (err) {
            console.error('Error deploying Safe:', err);
            setError(err instanceof Error ? err.message : 'Failed to deploy Safe');
        } finally {
            setLoading(false);
        }
    };

    return {
        createSafeAccount,
        deployedSafeAddress,
        loading,
        error
    };
};
