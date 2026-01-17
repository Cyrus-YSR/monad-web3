import { http, createConfig } from 'wagmi';
import { monadTestnet } from './chains';

const WALLET_CONNECT_PROJECT_ID = '你的真实WalletConnect_Project_ID';

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
