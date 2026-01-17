'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACT_CONFIG } from '../lib/config';

export default function Counter() {
  const { address, isConnected } = useAccount();
  const [customValue, setCustomValue] = useState<string>('1');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [forceRefresh, setForceRefresh] = useState(0);

  const { data: count, isLoading: isReading, error: readError, refetch } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'x',
    query: {
      enabled: isConnected,
      queryKey: ['counter', forceRefresh],
      refetchInterval: 2000,
    },
  });

  const { data: hash, writeContract, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setDebugInfo(`Transaction confirmed! Forcing refresh...`);
      setForceRefresh(prev => prev + 1);
      setTimeout(() => {
        refetch();
        setDebugInfo(`Refetch called at ${new Date().toLocaleTimeString()}. Count: ${count?.toString()}`);
      }, 500);
    }
  }, [isConfirmed, refetch, count]);

  const handleIncrement = async () => {
    try {
      setError('');
      setDebugInfo('Calling writeContract for increment...');
      const result = await writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'inc',
      });
      setDebugInfo(`writeContract called successfully! Result: ${result}`);
    } catch (err) {
      console.error('Error in handleIncrement:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setDebugInfo('writeContract failed with error above.');
    }
  };

  const handleIncrementBy = async () => {
    try {
      setError('');
      const value = BigInt(customValue);
      if (value <= 0n) {
        alert('Increment value must be positive');
        return;
      }
      setDebugInfo(`Calling writeContract for incrementBy with value: ${value}...`);
      const result = await writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'incBy',
        args: [value],
      });
      setDebugInfo(`writeContract called successfully! Result: ${result}`);
    } catch (err) {
      console.error('Error in handleIncrementBy:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setDebugInfo('writeContract failed with error above.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Counter DApp
        </h1>

        <div className="mb-6">
          <ConnectButton />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {isConnected && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Current Count</p>
              <div className="text-6xl font-bold text-blue-600">
                {isReading ? '...' : (count?.toString() || '0')}
              </div>
              {readError && (
                <p className="text-xs text-red-500 mt-2">
                  Error: {readError.message.slice(0, 50)}...
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleIncrement}
                disabled={isWriting || isConfirming}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isWriting || isConfirming ? 'Processing...' : 'Increment by 1'}
              </button>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  min="1"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter value"
                />
                <button
                  onClick={handleIncrementBy}
                  disabled={isWriting || isConfirming}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {isWriting || isConfirming ? '...' : 'Add'}
                </button>
              </div>
            </div>

            {hash && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Transaction Status:</p>
                {isConfirming && (
                  <p className="text-yellow-600 text-sm">Waiting for confirmation...</p>
                )}
                {isConfirmed && (
                  <p className="text-green-600 text-sm">Transaction confirmed!</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                </p>
              </div>
            )}

            {debugInfo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">{debugInfo}</p>
              </div>
            )}
          </div>
        )}

        {!isConnected && (
          <div className="text-center text-gray-600 mt-8">
            <p>Please connect your wallet to interact with the counter</p>
          </div>
        )}
      </div>
    </div>
  );
}
