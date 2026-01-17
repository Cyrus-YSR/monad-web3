import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前文件和目录的绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取ImageShare合约ABI
const imageShareArtifacts = JSON.parse(fs.readFileSync(resolve(__dirname, './artifacts/contracts/ImageShare.sol/ImageShare.json'), 'utf8'));
const accountNFTArtifacts = JSON.parse(fs.readFileSync(resolve(__dirname, './artifacts/contracts/AccountNFT.sol/AccountNFT.json'), 'utf8'));

// 读取当前配置文件
const configPath = resolve(__dirname, './frontend/src/app/lib/imageShareConfig.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// 更新ImageShare ABI
const updatedConfig = configContent
  // 替换ImageShare ABI
  .replace(/export const IMAGE_SHARE_ABI = \[([\s\S]*?)\];/, `export const IMAGE_SHARE_ABI = ${JSON.stringify(imageShareArtifacts.abi, null, 2)};`)
  // 确保AccountNFT ABI也是最新的
  .replace(/export const ACCOUNT_NFT_ABI = \[([\s\S]*?)\];/, `export const ACCOUNT_NFT_ABI = ${JSON.stringify(accountNFTArtifacts.abi, null, 2)};`);

// 写入更新后的配置文件
fs.writeFileSync(configPath, updatedConfig, 'utf8');

console.log('ABI updated successfully!');
