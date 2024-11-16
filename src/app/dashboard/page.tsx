'use client';
import {
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import LoginButton from 'src/components/LoginButton';
import ENSuiteSvg from 'src/svg/ENSuiteSvg';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { Tooltip } from "@nextui-org/tooltip";
import { PencilIcon } from "@heroicons/react/24/outline";

import { useAccount, useEnsName, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { subnameRows } from './utils/DefaultInfo';

import Safe, { type PredictedSafeProps } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { baseSepolia, sepolia } from 'viem/chains';
import { getBalance } from '@wagmi/core';
import { formatEther } from 'viem';
import { useWagmiConfig } from 'src/wagmi';

// Add this constant for the BaseScan URL
const BASESCAN_PREFIX = 'https://sepolia.basescan.org/address/';

// Add this interface for vault data
interface VaultData {
  address: string;
  name: string;
}

interface SafeBalance {
  address: string;
  balance: string;
  symbol: string;
  name?: string; // Add name to SafeBalance interface
}

export default function Dashboard() {
  const [signers, setSigners] = useState([{ name: '', address: '' }]);
  const [threshold, setThreshold] = useState('1');
  const [userSafes, setUserSafes] = useState<string[]>([]);
  const [safeBalances, setSafeBalances] = useState<SafeBalance[]>([]);
  const [vaultName, setVaultName] = useState<string>(''); // Add state for vault name input
  const [editingVault, setEditingVault] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  const { address } = useAccount();

  const { data: ensName } = useEnsName({
    address,
    chainId: sepolia.id,
    query: { enabled: Boolean(address) },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

  const config = useWagmiConfig();

  // Extract fetchUserSafes to a reusable function
  const fetchUserSafes = useCallback(async () => {
    if (!address) return;

    try {
      const apiKit = new SafeApiKit({
        chainId: BigInt(baseSepolia?.id || 84532),
      });

      const safes = await apiKit.getSafesByOwner(address);
      setUserSafes(safes.safes);
    } catch (error) {
      console.error('Error fetching safes:', error);
    }
  }, [address]);

  // Initial fetch of user safes
  useEffect(() => {
    fetchUserSafes();
  }, [fetchUserSafes]);

  const {
    isLoading: isTransactionPending,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
    query: {
      enabled: !!txHash,
    },
  });

  // Watch for transaction success
  useEffect(() => {
    if (isTransactionSuccess) {
      // Reset states
      setTxHash(undefined);
      setIsCreating(false);
      // Show success toast
      toast.success('Vault created successfully!');
      // Close the modal
      onOpenChange();
      // Refetch user safes
      fetchUserSafes();
    }
  }, [isTransactionSuccess, onOpenChange, fetchUserSafes]);

  // Watch for transaction error
  useEffect(() => {
    if (isTransactionError) {
      setIsCreating(false);
      setTxHash(undefined);
      toast.error('Failed to create vault. Please try again.');
    }
  }, [isTransactionError]);

  // Function to save vault name to localStorage
  const saveVaultName = (address: string, name: string) => {
    const vaults = JSON.parse(localStorage.getItem('vaults') || '{}');
    vaults[address] = name;
    localStorage.setItem('vaults', JSON.stringify(vaults));
  };

  // Function to get vault names from localStorage
  const getVaultNames = (): Record<string, string> => {
    return JSON.parse(localStorage.getItem('vaults') || '{}');
  };

  // Second useEffect to fetch balances
  useEffect(() => {
    const updateBalances = async () => {
      try {
        const vaultNames = getVaultNames();
        const balances = await Promise.all(
          userSafes.map(async (safeAddress) => {
            const balance = await getBalance(config, {
              address: safeAddress as `0x${string}`,
            });
            
            return {
              address: safeAddress,
              balance: formatEther(BigInt(balance.value)),
              symbol: 'ETH',
              name: vaultNames[safeAddress] || '' // Include the vault name
            };
          })
        );
        setSafeBalances(balances);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    if (userSafes.length > 0) {
      updateBalances();
    }
  }, [userSafes, config]);

  const addNewSigner = () => {
    setSigners([...signers, { name: '', address: '' }]);
  };

  const handleSignerChange = (
    index: number,
    field: 'name' | 'address',
    value: string,
  ) => {
    const updatedSigners = [...signers];
    updatedSigners[index][field] = value;
    setSigners(updatedSigners);
  };

  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      const updatedSigners = signers.filter((_, i) => i !== index);
      setSigners(updatedSigners);
      if (Number.parseInt(threshold) > updatedSigners.length) {
        setThreshold(updatedSigners.length.toString());
      }
    }
  };

  const handleCreateVault = async () => {
    try {
      setIsCreating(true);

      // Owners are the addresses from the signers list
      const owners = signers.map((signer) => signer.name);
      console.log('Signers: ', signers);

      const safeAccountConfig = {
        owners: owners,
        threshold: Number.parseInt(threshold),
      };

      // Safe deployment configuration
      const predictedSafe: PredictedSafeProps = {
        safeAccountConfig,
        safeDeploymentConfig: {
          saltNonce: userSafes.length.toString(),
        },
      };

      console.log('Creating vault with signers:', owners);
      console.log('Threshold:', threshold);

      // Initialize Safe
      let protocolKit = await Safe.init({
        provider: window.ethereum,
        signer: address,
        predictedSafe,
      });

      // Predict the address for Safe
      const safeAddress = await protocolKit.getAddress();
      console.log('Predicted Safe Address:', safeAddress);

      // Create deployment transaction
      const deploymentTransaction =
        await protocolKit.createSafeDeploymentTransaction();

      // Execute deployment transaction using integrated signer
      const client = await protocolKit.getSafeProvider().getExternalSigner();
      if (!client) throw new Error('Failed to get signer');

      const hash = await client.sendTransaction({
        to: deploymentTransaction.to,
        value: BigInt(deploymentTransaction.value),
        data: deploymentTransaction.data as `0x${string}`,
        chain: baseSepolia,
      });

      // Set the transaction hash to trigger the wait hook
      setTxHash(hash);
      
      // Save the vault name
      if (vaultName && safeAddress) {
        saveVaultName(safeAddress, vaultName);
      }

    } catch (error) {
      console.error('Error deploying Safe:', error);
      setIsCreating(false);
      toast.error('Failed to deploy Safe. Check the console for more details.');
    }
  };

  const handleUpdateVaultName = () => {
    if (!editingVault || !editingName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }
    
    saveVaultName(editingVault, editingName);
    
    setSafeBalances(prev => prev.map(balance => 
      balance.address === editingVault 
        ? { ...balance, name: editingName }
        : balance
    ));

    setEditingVault(null);
    setEditingName('');
    toast.success('Vault name updated successfully!');
  };

  const openEditModal = (address: string, currentName: string) => {
    setEditingVault(address);
    setEditingName(currentName || '');
    onEditOpen();
  };

  return (
    <div className="flex h-full w-full flex-col items-center px-4 py-8">
      {/* Header Section */}
      <section className="mt-20 mb-6 flex w-full">
        <div className="flex w-full items-center justify-between relative">
          <div className="absolute right-0">{address && <LoginButton />}</div>
          <div className="w-full flex justify-center">
            <a href="/" title="ENSuite">
              <ENSuiteSvg />
            </a>
          </div>
        </div>
      </section>

      <section className="text-center mb-10">
        <p className="text-2xl mt-2 text-gray-600">Hi, {ensName} 👋</p>
      </section>

      {/* Content Section */}
      <section className="flex flex-col w-full max-w-5xl items-center">
        {/* Tabs Container */}
        <div className="flex justify-center w-full">
          <div className="w-auto mx-auto">
            <Tabs
              aria-label="Options"
              variant="bordered"
              className="w-full justify-center"
            >
              <Tab key="vaults" title="Vaults Management">
                {/* Buttons Toolbar & Table Container */}
                <div className="flex flex-col items-center mt-6 w-full">
                  {/* Buttons Toolbar */}
                  <div className="flex justify-end w-full max-w-5xl mb-4">
                    <Button
                      color="danger"
                      variant="flat"
                      className="mr-2"
                      isDisabled={true}
                    >
                      Remove
                    </Button>
                    <Button onPress={onOpen} color="primary">
                      Create
                    </Button>
                    {/* Modal for Adding New Vault */}
                    <Modal
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                      placement="top-center"
                    >
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Create a Vault
                            </ModalHeader>
                            <ModalBody>
                              <Input
                                autoFocus
                                label="Vault Name"
                                placeholder="Happy Safe Vault"
                                variant="bordered"
                                value={vaultName}
                                onChange={(e) => setVaultName(e.target.value)}
                                fullWidth
                              />
                              {/* Signers Section */}
                              <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">
                                  Who can access this vault?
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                  Add the Ethereum addresses of the people who
                                  can access this vault. They will be able to
                                  execute transactions.
                                </p>
                                {signers.map((signer, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col md:flex-row gap-4 mb-4 items-center"
                                  >
                                    <div className="flex-1">
                                      <Input
                                        label={`ENS ${index + 1}`}
                                        placeholder={`Chad ${index + 1}`}
                                        value={signer.name}
                                        onChange={(e) =>
                                          handleSignerChange(
                                            index,
                                            'name',
                                            e.target.value,
                                          )
                                        }
                                        fullWidth={true}
                                      />
                                    </div>
                                    {signers.length > 1 && (
                                      <Button
                                        color="danger"
                                        onPress={() => removeSigner(index)}
                                        className="mt-2 md:mt-0"
                                      >
                                        <TrashIcon className="w-5 h-5" />
                                      </Button>
                                    )}
                                  </div>
                                ))}

                                {/* Add ENS Button */}
                                <Button
                                  color="success"
                                  variant="ghost"
                                  onPress={addNewSigner}
                                  startContent={
                                    <PlusIcon className="w-4 h-4" />
                                  }
                                  className="mt-4"
                                >
                                  Add another ENS
                                </Button>
                              </div>

                              {/* Threshold Section */}
                              <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-2">
                                  Threshold of the vault
                                </h3>
                                <p className="text-sm text-gray-400 mb-4">
                                  Any transaction requires the confirmation of:
                                </p>
                                <Input
                                  type="number"
                                  label="Threshold"
                                  min={1}
                                  max={signers.length}
                                  value={threshold}
                                  onChange={(e) => setThreshold(e.target.value)}
                                  className="max-w-xs"
                                  placeholder="Select threshold"
                                />
                              </div>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="primary"
                                onPress={handleCreateVault}
                                isLoading={isCreating || isTransactionPending}
                                isDisabled={isCreating || isTransactionPending}
                              >
                                {isTransactionPending ? 'Creating Vault...' : 'Create Vault'}
                              </Button>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  </div>
                  {/* Vaults Management Table */}
                  <div className="w-full max-w-5xl gap-3 justify-center">
                    <Table
                      aria-label="Vaults Management Table"
                      selectionMode="multiple"
                      className="w-full"
                    >
                      <TableHeader>
                        <TableColumn key="name" className="font-semibold text-gray-700">
                          NAME
                        </TableColumn>
                        <TableColumn key="address" className="font-semibold text-gray-700">
                          ADDRESS
                        </TableColumn>
                        <TableColumn key="balance" className="font-semibold text-gray-700">
                          BALANCE
                        </TableColumn>
                        <TableColumn key="actions" className="font-semibold text-gray-700">
                          ACTIONS
                        </TableColumn>
                      </TableHeader>
                      <TableBody>
                        {userSafes.map((safeAddress) => {
                          const safeBalance = safeBalances.find(sb => sb.address === safeAddress);
                          return (
                            <TableRow key={safeAddress}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{safeBalance?.name || 'Unnamed Vault'}</span>
                                  <Tooltip content="Edit name">
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="light"
                                      onPress={() => openEditModal(safeAddress, safeBalance?.name || '')}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </Button>
                                  </Tooltip>
                                </div>
                              </TableCell>
                              <TableCell>
                                <a 
                                  href={`${BASESCAN_PREFIX}${safeAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {`${safeAddress.slice(0, 6)}...${safeAddress.slice(-4)}`}
                                </a>
                              </TableCell>
                              <TableCell>
                                {safeBalance?.balance || '0'} {safeBalance?.symbol || 'ETH'}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" color="primary">
                                    Deposit
                                  </Button>
                                  <Button size="sm" color="default" isDisabled={true}>
                                    Manage
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Tab>
              <Tab key="subname" title="Subname Management">
                {/* Buttons Toolbar & Table Container */}
                <div className="flex flex-col items-center mt-6 w-full">
                  {/* Buttons Toolbar */}
                  <div className="flex justify-end w-full max-w-5xl mb-4">
                    <Button
                      color="danger"
                      variant="flat"
                      className="mr-2"
                      isDisabled={true}
                    >
                      Revoke
                    </Button>
                    <Button color="primary" isDisabled={true}>
                      Issue
                    </Button>
                  </div>
                  {/* Vaults Management Table */}
                  <div className="w-full max-w-5xl gap-3 justify-center">
                    <Table
                      aria-label="Vaults Management Table"
                      selectionMode="multiple"
                      className="w-full"
                    >
                      <TableHeader>
                        <TableColumn
                          key="subname"
                          className="font-semibold text-gray-700"
                        >
                          SUBNAME
                        </TableColumn>
                        <TableColumn
                          key="email"
                          className="font-semibold text-gray-700"
                        >
                          EMAIL
                        </TableColumn>
                        <TableColumn
                          key="enabled"
                          className="font-semibold text-gray-700"
                        >
                          ENABLED
                        </TableColumn>
                      </TableHeader>
                      <TableBody items={subnameRows}>
                        {(item) => (
                          <TableRow key={item.key}>
                            <TableCell>{item.subname}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                              <span className={item.statusClass}>
                                {item.ensuite}
                              </span>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Edit Name Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onOpenChange={onEditOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Vault Name
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Vault Name"
                  placeholder="Enter new vault name"
                  variant="bordered"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={() => {
                    handleUpdateVaultName();
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
