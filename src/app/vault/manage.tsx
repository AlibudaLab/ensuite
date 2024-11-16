'use client'

import Safe, {
    AddOwnerTxParams,
    SafeTransactionOptionalProps,
    RemoveOwnerTxParams
} from '@safe-global/protocol-kit'
import { baseSepolia } from 'viem/chains'
import { isAddress } from 'viem'
import { 
    useAccount, 
    usePublicClient,
    useWalletClient,
} from 'wagmi'
import { useState } from 'react'


const ADMIN_PRIVATE_KEY = "0x..."
const ADMIN_SAFE_ADDRESS = "0x..."

export const useManageVault = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [txHash, setTxHash] = useState<string>('');

    const { address: userAddress } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const addEmployee = async (employeeAddress: string) => {
        if (!walletClient || !userAddress) {
            setError('Wallet not connected');
            return;
        }

        if (!isAddress(employeeAddress)) {
            setError('Invalid employee address');
            return;
        }

        setLoading(true);
        try {
            const protocolKit = await Safe.init({
                provider: baseSepolia.rpcUrls.default.http[0],
                signer: ADMIN_PRIVATE_KEY,
                safeAddress: ADMIN_SAFE_ADDRESS
            });

            const params: AddOwnerTxParams = {
                ownerAddress: employeeAddress,
            };

            const addTransaction = await protocolKit.createAddOwnerTx(params);

            const client = await protocolKit.getSafeProvider().getExternalSigner()
            if (!client) throw new Error('Failed to get external signer')
        
            const signedSafeTx = await protocolKit.signTransaction(addTransaction);

            const executeTxResponse = await protocolKit.executeTransaction(signedSafeTx);
        
            console.log('New owner added successfully!');

            // get the updated owner list
            const owners = await protocolKit.getOwners();
            console.log('Current owners:', owners);

        } catch (error) {
            console.error('Error adding new owner:', error);
            setError(error instanceof Error ? error.message : 'Failed to add owner');
        } finally {
            setLoading(false);
        }
    };

    const removeEmployee = async (employeeAddress: string) => {
        if (!walletClient || !userAddress) {
            setError('Wallet not connected');
            return;
        }

        if (!isAddress(employeeAddress)) {
            setError('Invalid employee address');
            return;
        }

        setLoading(true);
        try {
            const protocolKit = await Safe.init({
                provider: baseSepolia.rpcUrls.default.http[0],
                signer: ADMIN_PRIVATE_KEY,
                safeAddress: ADMIN_SAFE_ADDRESS
            });
            const params: RemoveOwnerTxParams = {
                ownerAddress: employeeAddress,
            };

            const removeTransaction = await protocolKit.createRemoveOwnerTx(params);

            const client = await protocolKit.getSafeProvider().getExternalSigner()
            if (!client) throw new Error('Failed to get external signer')
        
            const signedSafeTx = await protocolKit.signTransaction(removeTransaction);

            const executeTxResponse = await protocolKit.executeTransaction(signedSafeTx);
        
            console.log('Owner removed successfully!');

            // get the updated owner list
            const owners = await protocolKit.getOwners();
            console.log('Current owners:', owners);

        } catch (error) {
            console.error('Error removing owner:', error);
            setError(error instanceof Error ? error.message : 'Failed to remove owner');
        } finally {
            setLoading(false);
        }
    };
    return {
        addEmployee,
        removeEmployee,
        loading,
        error,
        txHash
    };
};


