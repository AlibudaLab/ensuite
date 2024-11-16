'use client';
import { Address, EthBalance, Identity } from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import { normalize } from 'viem/ens';
import { User } from '@nextui-org/user';

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};
export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
}: WalletWrapperParams) {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    address,
    query: { enabled: Boolean(address) },
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: normalize(ensName ?? ''),
    query: { enabled: Boolean(address) },
  });

  return (
    <>
      <Wallet>
        <ConnectWallet
          withWalletAggregator={withWalletAggregator}
          text={text}
          className={className}
        >
          <User
            name={ensName}
            avatarProps={{
              src: ensAvatar ?? '',
            }}
          />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Address />
          </Identity>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <EthBalance />
          </Identity>
          {/* <WalletDropdownBasename /> */}
          {/* <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
            Go to Wallet Dashboard
          </WalletDropdownLink> */}
          {/* <WalletDropdownFundLink /> */}
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </>
  );
}
