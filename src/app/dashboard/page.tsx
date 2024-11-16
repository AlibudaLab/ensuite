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
  Dropdown,
  Select,
  SelectItem,
} from '@nextui-org/react';
import LoginButton from 'src/components/LoginButton';
import ENSuiteSvg from 'src/svg/ENSuiteSvg';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';

import { useAccount, useEnsName } from 'wagmi';
import { useState } from 'react';
import { subnameRows, vaultRows } from './utils/DefaultInfo';

export default function Dashboard() {
  const [signers, setSigners] = useState([{ name: '', address: '' }]);
  const [threshold, setThreshold] = useState(1);

  const { address } = useAccount();

  const { data: ensName } = useEnsName({
    address,
    query: { enabled: Boolean(address) },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      if (threshold > updatedSigners.length) {
        setThreshold(updatedSigners.length);
      }
    }
  };

  const handleThresholdChange = (value: string) => {
    setThreshold(Number(value));
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
                    <Button color="danger" variant="flat" className="mr-2">
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
                                autoFocus
                                label="Vault Name"
                                placeholder="Happy Safe Vault"
                                variant="bordered"
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
                                        fullWidth
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
                                <Select
                                  label="Threshold"
                                  value={threshold.toString()}
                                  onChange={(value) =>
                                    setThreshold(Number(value))
                                  }
                                  className="max-w-xs"
                                  placeholder="Select threshold"
                                >
                                  {signers.map((_, index) => (
                                    <SelectItem
                                      key={index + 1}
                                      value={(index + 1).toString()}
                                    >
                                      {index + 1} out of {signers.length}{' '}
                                      signer(s)
                                    </SelectItem>
                                  ))}
                                </Select>
                              </div>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="primary" onPress={onClose}>
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
                    <Button color="danger" variant="flat" className="mr-2">
                      Revoke
                    </Button>
                    <Button color="primary">Issue</Button>
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
