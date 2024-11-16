'use client';
import ENSuiteSvg from 'src/svg/ENSuiteSvg';
import { VLAYER_VERIFIER } from 'src/constants';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import LoginButton from '../components/LoginButton';
import verifierSpec from '../web3/contracts/EmailProofVerifier.json';
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
import { baseSepolia } from 'viem/chains';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';
import { getEnsNameFromEmail } from 'src/utils';

const generateEmailProof = async (emlProof: string) => {
  const toastId = toast.loading('Generating email proof...');
  try {
    const response = await fetch('/api/genproof', {
      method: 'POST',
      body: JSON.stringify({ emlProof }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      toast.error('Failed to generate email proof');
      return;
    }
    const { data } = await response.json();

    return data;
  } catch (error) {
    toast.error('Failed to generate email proof');
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

  // send tansaction
  const {
    data: verifyEmailHash,
    error: verifyEmailError,
    writeContract: verifyEmailCall,
  } = useWriteContract();

  const verifyEmail = async (emlProof: string) => {
    const data = await generateEmailProof(emlProof);
    if (!data) {
      return;
    }

    verifyEmailCall({
      address: VLAYER_VERIFIER,
      abi: verifierSpec.abi,
      functionName: 'verify',
      args: data as readonly unknown[],
      chain: baseSepolia,
    });
  };

  const { isLoading: isVerifying, isSuccess: isVerified } =
    useWaitForTransactionReceipt({
      hash: verifyEmailHash,
    });

  const registerEns = async (emlProof: string) => {
    toast.loading('Setting up ens subname');
    const ensName = getEnsNameFromEmail(emlProof);
    await fetch('/api/registerEns', {
      method: 'POST',
      body: JSON.stringify({ ensName, ensAddress }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(() => {
        toast.dismiss();
        toast.success('ENS subname registered successfully');
      })
      .catch((error) => {
        toast.dismiss();
        toast.error('Failed to register ENS subname');
        console.error('Failed to register ENS:', error);
      });
  };

  useEffect(() => {
    if (verifyEmailError) {
      toast.error('Failed to verify email');
    }

    if (isVerifying) {
      toast.loading('verifying proof onchain.');
    }

    if (isVerified) {
      toast.dismiss();
      toast.success('Email proof verified. Setting up ens subname');
      toast.loading('Setting up ens subname');
      registerEns(emlProof);
    }
  }, [isVerified, isVerifying, verifyEmailError]);
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center px-4">
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

      {/* Main Content Section */}
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
                  Go to the admin dashboard with current ENS
                </p>
                <Button
                  color="primary"
                  onPress={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
              </CardBody>
            </Card>

            {/* Claim My ENS Subname Card */}
            <Card className="w-full">
              <CardBody className="flex flex-col items-center text-center">
                <h2 className="font-semibold text-lg mb-2">
                  Claim My ENS Subname
                </h2>
                <p className="text-gray-600 mb-4">
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
                        label="Ethereum Address"
                        placeholder="Enter your Ethereum address"
                        variant="bordered"
                        value={ensAddress}
                        onValueChange={setEnsAddress}
                      />
                      {/* .eml File Input */}
                      <Textarea
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
                        onClick={() => verifyEmail(emlProof)}
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
