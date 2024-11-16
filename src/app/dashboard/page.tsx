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
} from "@nextui-org/react";
import LoginButton from "src/components/LoginButton";
import ENSuiteSvg from "src/svg/ENSuiteSvg";

import { useAccount, useEnsName } from 'wagmi';

export default function Dashboard() {
  const vaultRows = [
    {
      key: "1",
      name: "Ensuite",
      deposit: "Deposit",
      balance: "3,534,251",
      access: "Manage",
      txHistory: "Browse",
    },
    {
      key: "2",
      name: "Operation",
      deposit: "Deposit",
      balance: "24,042",
      access: "Manage",
      txHistory: "Browse",
    },
    {
      key: "3",
      name: "DevOp",
      deposit: "Deposit",
      balance: "54,825",
      access: "Manage",
      txHistory: "Browse",
    },
    {
      key: "4",
      name: "Marketing",
      deposit: "Deposit",
      balance: "3,624",
      access: "Manage",
      txHistory: "Browse",
    },
    {
      key: "5",
      name: "Travel",
      deposit: "Deposit",
      balance: "12,678",
      access: "Manage",
      txHistory: "Browse",
    },
  ];

  const subnameRows = [
    {
      key: "1",
      subname: "ryan.ensuite.eth",
      email: "ryan@ensuite.com",
      ensuite: "On",
      statusClass: "text-green-600",
    },
    {
      key: "2",
      subname: "nicole.ensuite.eth",
      email: "nicole@ensuite.com",
      ensuite: "On",
      statusClass: "text-green-600",
    },
    {
      key: "3",
      subname: "hao.ensuite.eth",
      email: "hao@ensuite.com",
      ensuite: "Off",
      statusClass: "text-red-600",
    },
    {
      key: "4",
      subname: "juno.ensuite.eth",
      email: "juno@ensuite.com",
      ensuite: "Off",
      statusClass: "text-red-600",
    },
    {
      key: "5",
      subname: "foodchain.ensuite.eth",
      email: "foodchain@ensuite.com",
      ensuite: "Off",
      statusClass: "text-red-600",
    },
  ];

  const { address } = useAccount();

  const { data: ensName } = useEnsName({
    address,
    query: { enabled: Boolean(address) },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            <Tabs aria-label="Options" variant="bordered" className="w-full justify-center">
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
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        placement="top-center"
                        >
                        <ModalContent>
                            {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                Create Vault
                                </ModalHeader>
                                <ModalBody>
                                {/* Ethereum Address Input */}
                                <Input
                                    autoFocus
                                    label="Name"
                                    placeholder="Happy Safe Vault"
                                    variant="bordered"
                                />
                                {/* .eml File Input */}
                                <Input
                                    label="Proof Document (.eml)"
                                    placeholder="Upload your proof document (.eml)"
                                    variant="bordered"
                                />
                                </ModalBody>
                                <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Submit
                                </Button>
                                </ModalFooter>
                            </>
                            )}
                        </ModalContent>
                    </Modal>
                  </div>
                  {/* Vaults Management Table */}
                  <div className="w-full max-w-5xl gap-3 justify-center">
                    <Table aria-label="Vaults Management Table" selectionMode="multiple" className="w-full">
                      <TableHeader>
                        <TableColumn key="name" className="font-semibold text-gray-700">
                          NAME
                        </TableColumn>
                        <TableColumn key="deposit" className="font-semibold text-gray-700">
                          DEPOSIT
                        </TableColumn>
                        <TableColumn key="balance" className="font-semibold text-gray-700">
                          BALANCE
                        </TableColumn>
                        <TableColumn key="access" className="font-semibold text-gray-700">
                          ACCESS
                        </TableColumn>
                        <TableColumn key="txHistory" className="font-semibold text-gray-700">
                          TX HISTORY
                        </TableColumn>
                      </TableHeader>
                      <TableBody items={vaultRows}>
                        {(item) => (
                          <TableRow key={item.key}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <button className="text-blue-600 underline">{item.deposit}</button>
                            </TableCell>
                            <TableCell>{item.balance}</TableCell>
                            <TableCell>
                              <button className="text-blue-600 underline">{item.access}</button>
                            </TableCell>
                            <TableCell>
                              <button className="text-blue-600 underline">{item.txHistory}</button>
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
                    <Button color="primary">
                      Issue
                    </Button>
                  </div>
                  {/* Vaults Management Table */}
                  <div className="w-full max-w-5xl gap-3 justify-center">
                    <Table aria-label="Vaults Management Table" selectionMode="multiple" className="w-full">
                        <TableHeader>
                        <TableColumn key="subname" className="font-semibold text-gray-700">
                            SUBNAME
                        </TableColumn>
                        <TableColumn key="email" className="font-semibold text-gray-700">
                            EMAIL
                        </TableColumn>
                        <TableColumn key="ensuite" className="font-semibold text-gray-700">
                            ENSUITE
                        </TableColumn>
                        </TableHeader>
                        <TableBody items={subnameRows}>
                      {(item) => (
                        <TableRow key={item.key}>
                          <TableCell>{item.subname}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>
                            <span className={item.statusClass}>{item.ensuite}</span>
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
