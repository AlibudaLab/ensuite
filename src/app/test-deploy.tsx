'use client'

import { DeployVault } from './vault/deploy'
import { useAccount } from 'wagmi'

export default function TestDeployPage() {
    const { createSafeAccount, deployedSafeAddress, loading, error } = DeployVault();
    const { address: userAddress, isConnected } = useAccount();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Test Safe Deployment</h1>
            
            {!isConnected ? (
                <p className="text-yellow-600">Please connect your wallet first</p>
            ) : (
                <>
                    <p className="mb-4">Connected Wallet: {userAddress}</p>
                    <button 
                        onClick={createSafeAccount}
                        disabled={loading}
                        className={`px-4 py-2 rounded ${
                            loading 
                                ? 'bg-gray-400' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                    >
                        {loading ? 'Deploying...' : 'Deploy New Safe'}
                    </button>
                </>
            )}

            {error && (
                <p className="text-red-500 mt-4">Error: {error}</p>
            )}
            
            {deployedSafeAddress && (
                <div className="mt-4">
                    <h2 className="font-bold">Deployed Safe Address:</h2>
                    <p className="font-mono">{deployedSafeAddress}</p>
                </div>
            )}
        </div>
    )
} 