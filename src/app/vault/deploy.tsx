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
const ADMIN_PRIVATE_KEY = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY

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
                owners: [adminAddress], 
                threshold: 1, 
            }

            const safeDeploymentConfig: SafeDeploymentConfig = {
                saltNonce: Date.now().toString(),
            }

            const predictedSafe: PredictedSafeProps = {
                safeAccountConfig,
            }

              
            const protocolKit = await Safe.init({
                provider: baseSepolia.rpcUrls.default.http[0],
                signer: ADMIN_PRIVATE_KEY,
                predictedSafe
              })

            const deployTx = await protocolKit.createSafeDeploymentTransaction()

        } catch (err) {
            console.error('Error deploying Safe:', err);
            setError(err instanceof Error ? err.message : 'Failed to deploy Safe');
        } finally {
            setLoading(false);
        }

        return {
            createSafeAccount,
            deployedSafeAddress,
            loading,
            error
        };
    };
}