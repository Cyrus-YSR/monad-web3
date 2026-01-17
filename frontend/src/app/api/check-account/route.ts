import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { AccountNFTABI } from '../../lib/imageShareConfig';

const CHAINS: Record<number, { rpcUrl: string; chain: typeof mainnet }> = {
  1: { rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo', chain: mainnet },
  11155111: { rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo', chain: sepolia },
  31337: { rpcUrl: 'http://127.0.0.1:8545', chain: mainnet },
  10143: { rpcUrl: 'https://testnet-rpc.monad.xyz', chain: mainnet },
};

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const;

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ hasAccount: false, error: 'Address required' }, { status: 400 });
    }

    const chainId = 31337;
    const chainConfig = CHAINS[chainId] || CHAINS[1];

    const client = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpcUrl),
    });

    let hasAccount = false;

    try {
      hasAccount = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: AccountNFTABI,
        functionName: 'hasAccount',
        args: [address as `0x${string}`],
      });
    } catch (err) {
      console.error('Error checking hasAccount:', err);
      try {
        const balance = await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: AccountNFTABI,
          functionName: 'balanceOf',
          args: [address as `0x${string}`],
        });
        hasAccount = balance > 0n;
      } catch (balanceErr) {
        console.error('Error checking balance:', balanceErr);
        hasAccount = false;
      }
    }

    return NextResponse.json({ hasAccount: Boolean(hasAccount) });
  } catch (err) {
    console.error('Error in check-account API:', err);
    return NextResponse.json({ hasAccount: false, error: 'Internal server error' }, { status: 500 });
  }
}
