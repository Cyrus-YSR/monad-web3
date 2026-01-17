import { http, createConfig } from 'wagmi';
import { hardhatLocal, monadTestnet } from './chains';

const WALLET_CONNECT_PROJECT_ID = '你的真实WalletConnect_Project_ID';

export const config = createConfig({
  chains: [hardhatLocal, monadTestnet],
  transports: {
    [hardhatLocal.id]: http(),
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
