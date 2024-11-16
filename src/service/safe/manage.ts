'use client';

import Safe, {
  AddOwnerTxParams,
  SafeTransactionOptionalProps,
  RemoveOwnerTxParams,
} from '@safe-global/protocol-kit';
import { baseSepolia } from 'viem/chains';
import { isAddress } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useState } from 'react';

const ADMIN_PRIVATE_KEY = '0x...';
const ADMIN_SAFE_ADDRESS = '0x...';


const addEmployee = async (userAddresses: string[]) => {
    try {
      const protocolKit = await Safe.init({
        provider: baseSepolia.rpcUrls.default.http[0],
        signer: ADMIN_PRIVATE_KEY,
        safeAddress: ADMIN_SAFE_ADDRESS,
      });

      const params: AddOwnerTxParams = {
        ownerAddress: userAddresses,
      };

      const addTransaction = await protocolKit.createAddOwnerTx(params);

      const client = await protocolKit.getSafeProvider().getExternalSigner();
      if (!client) throw new Error('Failed to get external signer');

      const signedSafeTx = await protocolKit.signTransaction(addTransaction);

      const executeTxResponse =
        await protocolKit.executeTransaction(signedSafeTx);

      console.log('New owner added successfully!');

      // get the updated owner list
      const owners = await protocolKit.getOwners();
      console.log('Current owners:', owners);
    } catch (error) {
    console.error('Error adding new owner:', error);
  }
};

  
const removeEmployee = async (userAddresses: string[]) => {
    try {
      const protocolKit = await Safe.init({
        provider: baseSepolia.rpcUrls.default.http[0],
        signer: ADMIN_PRIVATE_KEY,
        safeAddress: ADMIN_SAFE_ADDRESS,
      });
      const params: RemoveOwnerTxParams = {
        ownerAddress: userAddresses,
      };

      const removeTransaction = await protocolKit.createRemoveOwnerTx(params);

      const client = await protocolKit.getSafeProvider().getExternalSigner();
      if (!client) throw new Error('Failed to get external signer');

      const signedSafeTx = await protocolKit.signTransaction(removeTransaction);

      const executeTxResponse =
        await protocolKit.executeTransaction(signedSafeTx);

      console.log('Owner removed successfully!');

      // get the updated owner list
      const owners = await protocolKit.getOwners();
      console.log('Current owners:', owners);
    } catch (error) {
      console.error('Error removing owner:', error);
  };
};

export { addEmployee, removeEmployee };