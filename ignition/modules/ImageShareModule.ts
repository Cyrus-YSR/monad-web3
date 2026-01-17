import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ImageShareModule = buildModule('ImageShareModule', (m) => {
  // 设置初始铸造价格为 0.001 ETH
  const initialMintPrice = m.getParameter('initialMintPrice', '1000000000000000');

  // 部署 AccountNFT 合约
  const accountNFT = m.contract('AccountNFT', [initialMintPrice]);

  // 部署 ImageShare 合约，传入 AccountNFT 地址
  const imageShare = m.contract('ImageShare', [accountNFT]);

  return {
    accountNFT,
    imageShare,
  };
});

export default ImageShareModule;
