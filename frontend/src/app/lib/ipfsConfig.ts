// IPFS配置文件

// 注意：在实际项目中，应该将API密钥存储在环境变量中
// 这里使用一个示例API密钥，实际使用时需要替换为自己的密钥
export const IPFS_CONFIG = {
  // 可以使用Pinata、Web3.Storage或其他IPFS服务提供商
  // 这里我们使用免费的IPFS网关来展示图片
getIpfsGatewayUrl: (cid: string) => {
    return `https://ipfs.io/ipfs/${cid}`;
  },
};

// 用于生成随机文件名
export const generateRandomFileName = (originalName: string): string => {
  const extension = originalName.split('.').pop();
  const randomString = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  return `${timestamp}-${randomString}.${extension}`;
};
