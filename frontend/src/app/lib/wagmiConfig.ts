import { http, createConfig } from 'wagmi';
import { hardhatLocal, monadTestnet } from './chains';

const WALLET_CONNECT_PROJECT_ID = '41d078509902631f2a013b3cc230a647';

export const config = createConfig({
  chains: [hardhatLocal, monadTestnet],
  transports: {
    [hardhatLocal.id]: http(),
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
