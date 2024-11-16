'use client';
import ENSuiteSvg from 'src/svg/ENSuiteSvg';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import LoginButton from '../components/LoginButton';
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from '@nextui-org/react';
import toast from 'react-hot-toast';

const verifyEmail = async (ensAddress: string, emlProof: string) => {
  const toastId = toast.loading('Verifying email...');
  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ ensAddress, emlProof }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      toast.error('Failed to verify email');
      return;
    }
    toast.success('Verified!');
  } catch (error) {
    toast.error('Failed to verify email');
    console.error('Failed to verify email:', error);
  } finally {
    toast.dismiss(toastId);
  }
};

export default function Page() {
  const { address } = useAccount();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [ensAddress, setEnsAddress] = useState(address as string);
  const [emlProof, setEmlProof] = useState('');

  useEffect(() => {
    setEnsAddress(address as string);
  }, [address]);

  return (
    <div className="flex h-full w-full flex-col items-center px-4">
      <section className="mt-20 mb-6 flex w-full">
        <div className="flex w-full items-center justify-between relative">
          <div className="absolute right-0">{address && <LoginButton />}</div>
          <div className="w-full flex justify-center">
            <a href="/" title="ensuite">
              <ENSuiteSvg />
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center text-center py-10">
        <p className="font-alegreya text-xl max-w-2xl mb-8 whitespace-pre-line">
          {
            'Effortless expense management: ENS-powered vaults and\nsub-names for streamlined company spending.'
          }
        </p>

        {address ? (
          <div className="flex w-full max-w-4xl justify-between gap-8 mt-8">
            {/* Log in as Admin Card */}
            <Card className="w-full">
              <CardBody className="flex flex-col items-center text-center">
                <h2 className="font-semibold text-lg mb-2">Log in as Admin</h2>
                <p className="text-gray-600 mb-4">
                  This will use your primary ENS to log in
                </p>
                <Button color="primary">Log in</Button>
              </CardBody>
            </Card>

            {/* Claim My ENS Subname Card */}
            <Card className="w-full">
              <CardBody className="flex flex-col items-center text-center">
                <h2 className="font-semibold text-lg mb-2">
                  Claim My ENS Subname
                </h2>
                <p className="text-gray-600 mb-4">
                  {' '}
                  Generate the proof with your company email
                </p>
                <Button onPress={onOpen} color="primary">
                  Upload the Proof
                </Button>
              </CardBody>
            </Card>

            {/* Modal for Upload the Proof */}
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Upload Proof
                    </ModalHeader>
                    <ModalBody>
                      {/* Ethereum Address Input */}
                      <Input
                        autoFocus
                        label="Ethereum Address"
                        placeholder="Enter your Ethereum address"
                        variant="bordered"
                        value={ensAddress}
                        onValueChange={setEnsAddress}
                      />
                      {/* .eml File Input */}
                      <Textarea
                        autoFocus
                        label="Proof Document (.eml)"
                        placeholder="Upload your proof document (.eml)"
                        variant="bordered"
                        value={emlProof}
                        onValueChange={setEmlProof}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onPress={onClose}
                        onClick={() => verifyEmail(ensAddress, emlProof)}
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        ) : (
          <LoginButton />
        )}
      </section>
    </div>
  );
}
