'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink bg-[#3D43D2] hover:bg-[#343894]"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}
