// 'use client';
// // import Footer from 'src/components/Footer';
// // import TransactionWrapper from 'src/components/TransactionWrapper';
// // import WalletWrapper from 'src/components/WalletWrapper';
// // import { ONCHAINKIT_LINK } from 'src/links';
// // import OnchainkitSvg from 'src/svg/OnchainkitSvg';
// import ENSuiteSvg from 'src/svg/ENSuiteSvg';
// import { useAccount } from 'wagmi';
// import LoginButton from '../components/LoginButton';
// // import SignupButton from '../components/SignupButton';

// export default function Page() {
//   const { address } = useAccount();

//   return (
//     <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
//       <section className="mt-20 mb-6 flex w-full">
//         <div className="flex w-full items-center justify-between relative">
//           <div className="absolute right-0">
//             <LoginButton />
//           </div>
//           <div className="w-full flex justify-center">
//             <a href="/" title="ensuite">
//               <ENSuiteSvg />
//             </a>
//           </div>
//         </div>
//       </section>

//       <section className="flex flex-col items-center justify-center text-center py-20">
//         <p className="font-alegreya text-xl max-w-2xl mb-12 whitespace-pre-line">
//           {"Effortless expense management: ENS-powered vaults and\nsub-names for streamlined company spending."}
//         </p>
//       </section>
//       {/* <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
//         <div className="flex h-[450px] w-[450px] max-w-full items-center justify-center rounded-xl bg-[#030712]">
//           <div className="rounded-xl bg-[#F3F4F6] px-4 py-[11px]">
//             <p className="font-normal text-indigo-600 text-xl not-italic tracking-[-1.2px]">
//               npm install @coinbase/onchainkit
//             </p>
//           </div>
//         </div>
//         {address ? (
//           <TransactionWrapper address={address} />
//         ) : (
//           <WalletWrapper
//             className="w-[450px] max-w-full"
//             text="Sign in to transact"
//           />
//         )}
//       </section> */}
//       {/* <Footer /> */}
//     </div>
//   );
// }

'use client';
import ENSuiteSvg from 'src/svg/ENSuiteSvg';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react";

export default function Page() {
  const { address } = useAccount();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex h-full w-full flex-col items-center px-4">
      <section className="mt-20 mb-6 flex w-full">
        <div className="flex w-full items-center justify-between relative">
          <div className="absolute right-0">
            {address && <LoginButton />}
          </div>
          <div className="w-full flex justify-center">
            <a href="/" title="ensuite">
              <ENSuiteSvg />
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center text-center py-10">
        <p className="font-alegreya text-xl max-w-2xl mb-8 whitespace-pre-line">
          {"Effortless expense management: ENS-powered vaults and\nsub-names for streamlined company spending."}
        </p>

        {address ? (
          <div className="flex w-full max-w-4xl justify-between gap-8 mt-8">
            {/* Log in as Admin Card */}
            <Card className="w-full">
              <CardBody className="flex flex-col items-center text-center">
                <h2 className="font-semibold text-lg mb-2">Log in as Admin</h2>
                <p className="text-gray-600 mb-4">This will use your primary ENS to log in</p>
                <Button color="primary">
                  Log in
                </Button>
              </CardBody>
            </Card>

            {/* Claim My ENS Subname Card */}
            <Card className="w-full">
              <CardBody className="flex flex-col items-center text-center">
                <h2 className="font-semibold text-lg mb-2">Claim My ENS Subname</h2>
                <p className="text-gray-600 mb-4"> Generate the proof with your company email</p>
                <Button onPress={onOpen} color="primary">
                  Upload the Proof
                </Button>
              </CardBody>
            </Card>

            {/* Modal for Upload the Proof */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Upload Proof</ModalHeader>
                    <ModalBody>
                      {/* Ethereum Address Input */}
                      <Input
                        autoFocus
                        label="Ethereum Address"
                        placeholder="Enter your Ethereum address"
                        variant="bordered"
                      />
                      {/* .eml File Input */}
                      <Input
                        autoFocus
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
        ) : (
          <LoginButton />
        )}
      </section>
    </div>
  );
}
