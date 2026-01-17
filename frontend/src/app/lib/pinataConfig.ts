// Pinata配置文件

// 从环境变量中读取JWT令牌
// 在实际项目中，应该将JWT令牌存储在环境变量中
// NEXT_PUBLIC_前缀是必须的，这样Next.js客户端组件才能访问到这个环境变量
export const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';

export const PINATA_ENDPOINTS = {
  pinFileToIPFS: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  pinJSONToIPFS: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
};

// 上传文件到Pinata
export const uploadToPinata = async (file: File): Promise<string> => {
  // 检查是否提供了JWT令牌
  if (!PINATA_JWT) {
    // 如果没有提供JWT令牌，生成一个模拟的IPFS CID用于测试
    console.warn('No Pinata JWT provided, using mock CID for testing');
    const mockCid = `Qm${Math.random().toString(36).substring(2, 34)}`;
    return mockCid;
  }

  const formData = new FormData();
  formData.append('file', file);

  // Pinata API v2使用JWT令牌进行认证
  const response = await fetch(PINATA_ENDPOINTS.pinFileToIPFS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to upload file to Pinata: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.IpfsHash;
};

// 上传JSON数据到Pinata
export const uploadJSONToPinata = async <T extends Record<string, unknown>>(json: T): Promise<string> => {
  // 检查是否提供了JWT令牌
  if (!PINATA_JWT) {
    // 如果没有提供JWT令牌，生成一个模拟的IPFS CID用于测试
    console.warn('No Pinata JWT provided, using mock CID for testing');
    const mockCid = `Qm${Math.random().toString(36).substring(2, 34)}`;
    return mockCid;
  }

  const response = await fetch(PINATA_ENDPOINTS.pinJSONToIPFS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: json,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to upload JSON to Pinata: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.IpfsHash;
};
