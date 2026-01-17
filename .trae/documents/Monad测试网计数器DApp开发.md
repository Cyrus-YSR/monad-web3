# Monad测试网计数器DApp前端实现计划

## 阶段1：修复配置（严格按后端配置）
1. **更新chains.ts**：将链ID从888888888改为10143（与hardhat.config.ts一致）
2. **更新Providers.tsx**：将chains从主网改为Monad测试网
3. **生成正确的ABI**：根据Counter.sol生成准确的ABI（包含x、inc、incBy、Increment事件）
4. **创建合约地址配置**：创建config.ts存储已部署的Counter合约地址

## 阶段2：创建Counter组件
1. **创建Counter.tsx组件**（客户端组件）：
   - 使用useAccount显示钱包连接状态
   - 使用useReadContract读取x的值
   - 使用useWriteContract调用inc()函数
   - 使用useWriteContract调用incBy(uint by)函数
   - 使用useWaitForTransactionReceipt等待交易确认
   - 显示交易状态（加载中、成功、失败）

2. **UI设计**：
   - 显示当前计数器值（大字体）
   - "增加1"按钮
   - "增加N"输入框和按钮
   - 钱包连接按钮（RainbowKit的ConnectButton）
   - 交易状态提示

## 阶段3：更新主页面
1. **修改page.tsx**：导入并使用Counter组件
2. **移除默认内容**：删除Next.js默认的欢迎页面内容

## 技术实现要点
- 严格使用后端的链ID：10143
- 严格使用后端的RPC：https://testnet-rpc.monad.xyz/
- 严格匹配Counter.sol的函数：x、inc()、incBy(uint by)
- 使用Viem的Hooks进行合约交互
- 使用Tailwind CSS进行样式设计