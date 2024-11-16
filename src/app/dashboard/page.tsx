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
import LoginButton from 'src/components/LoginButton';
import ENSuiteSvg from 'src/svg/ENSuiteSvg';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';

import { useAccount, useEnsName } from 'wagmi';
import { useState, useEffect } from 'react';
import { subnameRows, vaultRows } from './utils/DefaultInfo';

import Safe, { type PredictedSafeProps } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { baseSepolia } from 'viem/chains';

export default function Dashboard() {
  const [signers, setSigners] = useState([{ name: '', address: '' }]);
  const [threshold, setThreshold] = useState('1');
  const [userSafes, setUserSafes] = useState<any[]>([]);

  const { address, chain } = useAccount();

  const { data: ensName } = useEnsName({
    address,
    query: { enabled: Boolean(address) },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchUserSafes = async () => {
      if (!address) return;

      try {
        const apiKit = new SafeApiKit({
          chainId: BigInt(chain?.id || 8453),
        });

        const safes = await apiKit.getSafesByOwner(address);
        console.log('User Safes:', safes);
        setUserSafes(safes.safes);
      } catch (error) {
        console.error('Error fetching safes:', error);
      }
    };

    fetchUserSafes();
  }, [address]);

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
          // saltNonce can be added if necessary
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

      const txHash = await client.sendTransaction({
        to: deploymentTransaction.to,
        value: BigInt(deploymentTransaction.value),
        data: deploymentTransaction.data as `0x${string}`,
        chain: baseSepolia,
      });

      // Wait for the transaction to be mined
      // const txReceipt = await client.waitForTransactionReceipt({ hash: txHash });

      // Reconnect to the newly deployed Safe using the protocol-kit
      protocolKit = await protocolKit.connect({ safeAddress });

      // Confirm deployment and log properties
      console.log('Is Safe deployed:', await protocolKit.isSafeDeployed());
      console.log('Safe Address:', await protocolKit.getAddress());
      console.log('Safe Owners:', await protocolKit.getOwners());
      console.log('Safe Threshold:', await protocolKit.getThreshold());
      alert(`Your Safe has been deployed:\n${safeAddress}`);
    } catch (error) {
      console.error('Error deploying Safe:', error);
      alert('Failed to deploy Safe. Check the console for more details.');
    }
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
                              {/* Vault Name Input */}
                              <Input
                                autoFocus={true}
                                label="Vault Name"
                                placeholder="Happy Safe Vault"
                                variant="bordered"
                                fullWidth={true}
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
                              >
                                Create
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
                        <TableColumn
                          key="name"
                          className="font-semibold text-gray-700"
                        >
                          NAME
                        </TableColumn>
                        <TableColumn
                          key="deposit"
                          className="font-semibold text-gray-700"
                        >
                          DEPOSIT
                        </TableColumn>
                        <TableColumn
                          key="balance"
                          className="font-semibold text-gray-700"
                        >
                          BALANCE
                        </TableColumn>
                        <TableColumn
                          key="access"
                          className="font-semibold text-gray-700"
                        >
                          ACCESS
                        </TableColumn>
                        <TableColumn
                          key="txHistory"
                          className="font-semibold text-gray-700"
                        >
                          TX HISTORY
                        </TableColumn>
                      </TableHeader>
                      <TableBody items={vaultRows}>
                        {(item) => (
                          <TableRow key={item.key}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <button className="text-blue-600 underline">
                                {item.deposit}
                              </button>
                            </TableCell>
                            <TableCell>{item.balance}</TableCell>
                            <TableCell>
                              <button className="text-blue-600 underline">
                                {item.access}
                              </button>
                            </TableCell>
                            <TableCell>
                              <button className="text-blue-600 underline">
                                {item.txHistory}
                              </button>
                            </TableCell>
                          </TableRow>
                        )}
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
                          key="ensuite"
                          className="font-semibold text-gray-700"
                        >
                          ENSUITE
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
    </div>
  );
}
