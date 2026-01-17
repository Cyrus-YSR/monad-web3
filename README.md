# Counter DApp - Web3 计数器应用

这是一个基于 Monad 测试网的 Web3 计数器应用，展示了如何使用 Hardhat 3 Beta、Solidity 智能合约、Next.js 和 Wagmi 库构建完整的去中心化应用。

## 项目内容

### 1. 智能合约

- **Counter.sol**: 一个简单的计数器智能合约，包含以下功能：
  - `x()`: 获取当前计数器值
  - `inc()`: 计数器加 1
  - `incBy(uint256 by)`: 计数器加指定值
  - `Increment(uint256 by)`: 计数器增加时触发的事件

### 2. 前端应用

- **Next.js 14**: 使用 App Router 的现代化 React 框架
- **Wagmi 2.9**: React Hooks 库，用于与以太坊区块链交互
- **RainbowKit 2.1**: 美观且易用的钱包连接组件
- **Viem 2.9**: 轻量级以太坊客户端库

## 运行方法

### 前置要求

- Node.js 18+ 和 npm
- MetaMask 或其他以太坊钱包

### 1. 安装依赖

```bash
# 安装项目根目录的依赖
npm install

# 安装前端应用的依赖
cd frontend
npm install
```

### 2. 启动本地 Hardhat 节点

```bash
# 在项目根目录
npx hardhat node
```

### 3. 部署智能合约

```bash
# 在项目根目录
npx hardhat ignition deploy ./ignition/modules/Counter.ts --network localhost
```

### 4. 启动前端开发服务器

```bash
# 在 frontend 目录
npm run dev
```

### 5. 访问应用

打开浏览器访问 <http://localhost:3000>

### 6. 连接钱包

1. 点击 "Connect Wallet" 按钮
2. 选择 MetaMask 或其他钱包
3. 切换到本地 Hardhat 网络（Chain ID: 31337）
4. 使用 Hardhat 节点提供的测试账户

### 7. 测试功能

- 点击 "Increment by 1" 按钮，计数器加 1
- 输入数值后点击 "Add" 按钮，计数器加指定值
- 查看交易状态和计数器值的实时更新

## 项目结构

```
.
├── contracts/              # 智能合约目录
│   └── Counter.sol        # 计数器智能合约
├── frontend/              # 前端应用目录
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── Counter.tsx      # 计数器组件
│   │   │   │   └── Providers.tsx    # 钱包连接提供者
│   │   │   ├── lib/
│   │   │   │   ├── chains.ts        # 区块链配置
│   │   │   │   ├── config.ts        # 智能合约配置
│   │   │   │   └── wagmiConfig.ts   # Wagmi 配置
│   │   │   ├── layout.tsx           # 页面布局
│   │   │   └── page.tsx             # 首页
│   │   └── globals.css              # 全局样式
│   └── package.json
├── ignition/              # 智能合约部署配置
│   └── modules/
│       └── Counter.ts
├── test/                  # 测试文件目录
└── hardhat.config.ts     # Hardhat 配置
```

## 技术栈

- **后端**: Solidity 0.8.28, Hardhat 3.1.3
- **前端**: Next.js 14.2.35, React 18, TypeScript
- **Web3**: Wagmi 2.9, RainbowKit 2.1, Viem 2.9
- **样式**: Tailwind CSS 3.4.1

## 智能合约地址

本地 Hardhat 网络: 0x5FbDB2315678afecb367f032d93F642f64180aa3

## 常见问题

### 1. 钱包连接失败

- 确保钱包已切换到本地 Hardhat 网络
- 检查 Chain ID 是否为 31337
- 确保使用 Hardhat 节点提供的测试账户

### 2. 交易失败

- 确保账户有足够的 ETH
- 检查智能合约地址是否正确
- 查看浏览器控制台的错误信息

### 3. 计数器值不更新

- 检查网络连接
- 确保交易已被确认
- 尝试刷新页面

## 许可证

MIT
