'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ACCOUNT_NFT_CONFIG, IMAGE_SHARE_CONFIG } from '../lib/imageShareConfig';
import { uploadToPinata } from '../lib/pinataConfig';

export default function ImageUpload() {
  const { address, isConnected, chain } = useAccount();
  const [image, setImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPinataUploading, setIsPinataUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [isCheckingAccount, setIsCheckingAccount] = useState(true);

  const currentNetworkId = chain?.id || 10143;

  const checkAccount = useCallback(async () => {
    if (!address || !isConnected) {
      setHasAccount(false);
      setIsCheckingAccount(false);
      return;
    }

    try {
      const balanceResponse = await fetch('/api/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (balanceResponse.ok) {
        const data = await balanceResponse.json();
        setHasAccount(data.hasAccount);
      } else {
        setHasAccount(false);
      }
    } catch (err) {
      console.error('Error checking account:', err);
      setHasAccount(false);
    } finally {
      setIsCheckingAccount(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    checkAccount();
  }, [checkAccount]);

  const { data: hash, writeContract, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setSuccess('Image shared successfully!');
      setIsUploading(false);
      setImage('');
      setImageFile(null);
      setText('');
      checkAccount();
    }
  }, [isConfirmed, checkAccount]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    try {
      if (!image) {
        setError('Please select an image');
        return;
      }

      if (!text.trim()) {
        setError('Please enter some text');
        return;
      }

      if (!imageFile) {
        setError('Image file not found');
        return;
      }

      setError('');
      setSuccess('');
      setIsUploading(true);
      setIsPinataUploading(true);

      const imageHash = await uploadToPinata(imageFile);
      setIsPinataUploading(false);
      
      await writeContract({
        ...IMAGE_SHARE_CONFIG,
        functionName: 'shareImage',
        args: [imageHash, text, BigInt(currentNetworkId)],
      });
    } catch (err) {
      console.error('Error sharing image:', err);
      setError(`Error sharing image: ${err instanceof Error ? err.message : String(err)}`);
      setIsUploading(false);
      setIsPinataUploading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet First</h2>
        <p className="text-gray-600">Please connect your wallet to share images.</p>
      </div>
    );
  }

  if (isCheckingAccount) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking account status...</p>
      </div>
    );
  }

  if (!hasAccount) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Need an Account NFT</h2>
        <p className="text-gray-600">Please mint an account NFT first.</p>
        <a href="/mint" className="text-blue-600 hover:underline mt-4 inline-block">
          Go to Mint Page
        </a>
        <button
          onClick={checkAccount}
          className="block mt-4 text-sm text-gray-500 hover:text-gray-700 mx-auto"
        >
          Refresh status
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Share Image</h2>

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something about your image..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <button
          onClick={handleShare}
          disabled={isUploading || isWriting || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {isPinataUploading ? 'Uploading to IPFS...' : isWriting || isConfirming ? 'Processing transaction...' : 'Share Image'}
        </button>
      </div>
    </div>
  );
}
