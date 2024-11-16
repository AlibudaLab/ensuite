'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink bg-[#016FEE] hover:bg-[#016FEE]/90"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}
