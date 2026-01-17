import { http, createConfig } from 'wagmi';
import { hardhatLocal, monadTestnet } from './chains';

export const config = createConfig({
  chains: [hardhatLocal, monadTestnet],
  transports: {
    [hardhatLocal.id]: http(),
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
