'use client'

import Safe, {
    PredictedSafeProps,
    SafeAccountConfig,
    SafeDeploymentConfig
} from '@safe-global/protocol-kit'
import { baseSepolia } from 'viem/chains'
import { 
    useAccount, 
    usePublicClient, 
    useWalletClient,
} from 'wagmi'
import { useState } from 'react'
import { parseEther } from 'viem'

interface DeployVaultProps {
    adminAddress: string;
}

// TODO: admin key should be take from the wallet
const ADMIN_PRIVATE_KEY = "0x..."
const ADMIN_Safe_Address = "0x..."


export const DeployVault = ({ adminAddress }: DeployVaultProps) => {
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

    const safeAccountConfig: SafeAccountConfig = {
        owners: [ADMIN_Safe_Address],
        threshold: 1
        // More optional properties
    }
  
    const predictedSafe: PredictedSafeProps = {
        safeAccountConfig
        // More optional properties
    }
    
    const protocolKit = await Safe.init({
        provider: baseSepolia.rpcUrls.default.http[0],
        signer: ADMIN_PRIVATE_KEY,
        predictedSafe
    })

    const initialSafeAddress = await protocolKit.getAddress()

    const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()

    const client = await protocolKit.getSafeProvider().getExternalSigner()
    if (!client) throw new Error('Failed to get external signer')

    const transactionHash = await client.sendTransaction({
    to: deploymentTransaction.to,
    value: BigInt(deploymentTransaction.value),
    data: deploymentTransaction.data as `0x${string}`,
    chain: baseSepolia as any
    })

    // const transactionReceipt = await client.waitForTransactionReceipt({
    //   hash: transactionHash
    // })

    const newProtocolKit = await protocolKit.connect({
        safeAddress: initialSafeAddress
    })
    
    const isSafeDeployed = await newProtocolKit.isSafeDeployed() // True
    const safeAddress = await newProtocolKit.getAddress()
    const safeOwners = await newProtocolKit.getOwners()
    const safeThreshold = await newProtocolKit.getThreshold()
  

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
