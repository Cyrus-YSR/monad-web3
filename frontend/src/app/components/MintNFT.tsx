'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ACCOUNT_NFT_CONFIG } from '../lib/imageShareConfig';

export default function MintNFT() {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [mintPrice, setMintPrice] = useState<string>('');
  const [hasAccount, setHasAccount] = useState<boolean>(false);

  // 读取铸造价格
  const { data: price, isLoading: isReadingPrice } = useReadContract({
    ...ACCOUNT_NFT_CONFIG,
    functionName: 'mintPrice',
    query: {
      enabled: isConnected,
    },
  });

  // 检查用户是否已有账号
  const { data: accountStatus } = useReadContract({
    ...ACCOUNT_NFT_CONFIG,
    functionName: 'hasAccount',
    args: [address],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { data: hash, writeContract, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (price) {
      setMintPrice((Number(price) / 1e18).toString());
    }
  }, [price]);

  useEffect(() => {
    if (accountStatus !== undefined) {
      setHasAccount(accountStatus);
    }
  }, [accountStatus]);

  useEffect(() => {
    if (isConfirmed) {
      setSuccess('NFT minted successfully! You can now share images.');
      setIsMinting(false);
      // 刷新账号状态
      setHasAccount(true);
    }
  }, [isConfirmed]);

  const handleMint = async () => {
    try {
      setError('');
      setSuccess('');
      setIsMinting(true);

      await writeContract({
        ...ACCOUNT_NFT_CONFIG,
        functionName: 'mint',
        value: price,
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(`Error minting NFT: ${err instanceof Error ? err.message : String(err)}`);
      setIsMinting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet First</h2>
        <p className="text-gray-600">Please connect your wallet to mint an account NFT.</p>
      </div>
    );
  }

  if (hasAccount) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Account Already Created</h2>
        <p className="text-gray-600">You already have an account NFT. You can now share images.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Mint Account NFT</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <p className="text-xs text-green-600">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Mint Price</label>
          <span className="text-sm font-semibold">
            {isReadingPrice ? 'Loading...' : `${mintPrice} ETH`}
          </span>
        </div>

        <button
          onClick={handleMint}
          disabled={isMinting || isWriting || isConfirming || isReadingPrice}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {isMinting || isWriting || isConfirming ? 'Processing...' : `Mint for ${mintPrice} ETH`}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By minting this NFT, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}
