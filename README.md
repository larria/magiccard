# Magic Card

魔法卡牌 —— 纯前端卡牌收集 / 合成 / 变卡游戏（数据本地持久化，无后端）。

## 技术栈

- **构建**：Vite 7 + `@vitejs/plugin-react`
- **框架**：React 19 + TypeScript（全量）
- **状态管理**：Zustand 5（`persist` 中间件，localStorage 持久化）
- **路由**：React Router 7（HashRouter 模式）
- **UI**：Ant Design 5（CSS-in-JS，`ConfigProvider` + `App`）
- **数据**：卡牌数据预编译为 JSON（`src/data/gameData.json`），运行时直接查询

## 开发

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 类型检查 + 生产构建（产物在 dist/）
npm run preview  # 预览生产构建
npm run typecheck  # 仅类型检查
```

## 项目结构

```
src/
  main.tsx              # 入口：ConfigProvider + antd App + HashRouter
  App.tsx               # 根路由 + 主布局（Sider + 嵌套路由）
  config.ts             # 头像/升级奖励等静态配置
  getURL.ts             # 卡牌图片 CDN 地址拼接
  time.ts               # 简易定时任务
  utils.ts              # 主题集齐检查、炉位状态计算等纯函数
  assets/               # logo 等静态资源（走构建管线）
  types/card.ts         # 卡牌数据类型定义
  data/
    gameData.json       # 卡牌数据（由 scripts/convert_data.py 从 XML 生成）
    getData.ts          # 卡牌/主题/合成规则查询
  store/
    useGameStore.ts     # Zustand store（状态 + actions + persist）
    dispatchActionWithBusiness.ts  # 业务 action 门面（读 state + 多次写）
    types.ts            # 状态类型定义
  components/           # 全部 UI 组件（函数组件 + hooks）
scripts/
  convert_data.py       # 一次性脚本：XML → JSON
```

## 数据生成

`src/data/gameData.json` 由 `scripts/convert_data.py` 从原始 XML 数据生成：

```bash
python3 scripts/convert_data.py
```

## 部署

项目已配置为 PWA，并可通过 GitHub Actions 自动部署到 GitHub Pages。

### PWA

使用 `vite-plugin-pwa`（基于 Workbox）：
- Service Worker（`autoUpdate`）自动注册，precache app shell（HTML/JS/CSS，约 3.3MB）
- 卡牌 / 主题 / 头像图（678M）通过 runtimeCaching 按需缓存（CacheFirst，上限 5000 条）
- manifest 含图标、主题色、maskable 图标，可安装到桌面

### GitHub Pages 部署

执行 `npm run deploy`（即 `scripts/deploy.sh`）：以 `BASE_PATH=/magiccard/` 构建，在 `dist` 内初始化独立 git 仓库并推送到远程 `gh-pages` 分支。

```bash
npm run deploy
```

> 不使用 `gh-pages` npm 包：本项目 `dist` 含近 4 万个文件（卡牌图），`gh-pages` 包的 `git rm` 阶段会触发 `spawn E2BIG`（命令行参数超限），故改用脚本直接 git 推送。

**首次部署需在仓库 Settings → Pages → Build and deployment → Source 选择 "Deploy from a branch"，分支选 `gh-pages`、目录选 `/ (root)`。**

本地预览生产构建（模拟 GitHub Pages 路径）：

```bash
BASE_PATH=/magiccard/ npm run build
# 用支持子路径的静态服务器（vite preview 对子路径静态文件有 SPA fallback，不适用）
npx serve dist
```

> 注意：`public/assets/` 体积约 678MB（近 3 万张卡牌图），需在仓库中。
