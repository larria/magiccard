# 架构总览

Magic Card 是一个纯前端的卡牌收集 / 合成 / 变卡游戏，无后端 API，所有状态通过浏览器 localStorage 持久化。本文档描述项目的整体技术架构与各层职责。

## 技术栈

| 层 | 技术 | 版本 | 说明 |
|---|---|---|---|
| 构建工具 | Vite | 7.x | 替代 CRA，esbuild 预构建 + Rollup 打包 |
| 框架 | React | 19.x | 全量函数组件 + Hooks |
| 语言 | TypeScript | 5.9.x | strict 模式，全量类型 |
| 状态管理 | Zustand | 5.x | `persist` 中间件持久化，替代 Redux |
| 路由 | React Router | 7.x | HashRouter 模式（兼容 GitHub Pages 子路径） |
| UI 组件库 | Ant Design | 5.x | CSS-in-JS，`ConfigProvider` + `App` |
| PWA | vite-plugin-pwa | 1.x | 基于 Workbox，自动生成 SW + manifest |
| 数据格式 | JSON | — | 卡牌数据预编译为 JSON，运行时直接查询 |

## 分层架构

```
┌──────────────────────────────────────────────────────┐
│  路由层 (src/App.tsx)                                 │
│  HashRouter + 嵌套 Route + Outlet                     │
├──────────────────────────────────────────────────────┤
│  UI 组件层 (src/components/*.tsx)                     │
│  纯函数组件，通过 useGameStore 订阅状态               │
│  通过 dpa 门面触发业务 action                         │
├──────────────────────────────────────────────────────┤
│  业务 action 门面 (src/store/dispatchActionWithBusiness.ts)  │
│  封装「读 state + 多次写 state」的编排逻辑            │
│  组件只调 dpa.xxx()，不直接操作 store                 │
├──────────────────────────────────────────────────────┤
│  状态层 (src/store/useGameStore.ts)                   │
│  Zustand store：13 个状态分片 + 具名 actions          │
│  persist 中间件 → localStorage（key: magic_card_v1）  │
├──────────────────────────────────────────────────────┤
│  数据层 (src/data/getData.ts)                         │
│  纯函数查询：getThemeList/getCardById/...             │
│  模块加载时预建 themeId→cards 索引                    │
├──────────────────────────────────────────────────────┤
│  工具层 (src/utils.ts, src/time.ts, src/getURL.ts)    │
│  纯函数：主题集齐检查、炉位计算、时间格式化、图片 URL │
└──────────────────────────────────────────────────────┘
```

## 目录结构

```
magiccard/
├── docs/                          # 开发文档
├── public/
│   ├── assets/                    # 静态资源（卡牌图/主题图/UI精灵图/头像，约 678MB）
│   ├── favicon.ico
│   ├── pwa-192.png                # PWA 图标
│   ├── pwa-512.png
│   └── apple-touch-icon.png
├── scripts/
│   ├── convert_data.py            # 一次性脚本：原始 XML → gameData.json
│   └── deploy.sh                  # 部署脚本：build + 推送 gh-pages 分支
├── src/
│   ├── assets/                    # 走构建管线的资源（logo.png）
│   ├── components/                # 全部 UI 组件（函数组件 + Hooks）
│   ├── data/
│   │   ├── gameData.json          # 卡牌数据（903 主题 / 14860 卡 / 7673 合成规则）
│   │   └── getData.ts             # 数据查询函数 + 预建索引
│   ├── store/
│   │   ├── useGameStore.ts        # Zustand store（状态 + actions + persist）
│   │   ├── dispatchActionWithBusiness.ts  # 业务 action 门面（dpa）
│   │   └── types.ts               # 状态类型定义
│   ├── types/
│   │   └── card.ts                # 卡牌数据类型（ThemeAttr/CardAttr/CombAttr）
│   ├── App.tsx                    # 根组件：路由定义 + 主布局
│   ├── App.css                    # 全局样式
│   ├── config.ts                  # 静态配置（头像列表/升级奖励）
│   ├── getURL.ts                  # 卡牌/主题图片 URL 拼接
│   ├── main.tsx                   # 入口：ConfigProvider + antd App + HashRouter
│   ├── time.ts                    # 简易定时任务管理
│   ├── utils.ts                   # 业务纯函数（集齐检查/炉位状态计算）
│   └── vite-env.d.ts              # Vite 类型声明
├── index.html                     # Vite 入口 HTML
├── vite.config.ts                 # Vite + PWA 配置
├── tsconfig.json                  # TypeScript 配置（strict）
└── package.json
```

## 数据流

以「抽卡」为例：

```
用户点击「抽卡」按钮
  ↓
BagCtrl.drawACardToBag()                    [组件事件处理]
  ↓ 读取
useGameStore → bagList, repStat, drawStat   [状态订阅]
  ↓ 调用业务 action
dpa.addACardToBagList(cardId)               [dpa 门面]
  ↓
useGameStore.getState().addCardToBag(cardId) [store action]
  ↓
set({ bagList: [...s.bagList, cardId] })    [Zustand 写入]
  ↓
persist 中间件自动同步到 localStorage        [持久化]
  ↓
所有订阅 bagList 的组件重渲染                [UI 更新]
```

## 核心设计决策

### 为什么选 Zustand 而非 Redux

- 项目原用 Redux（13 个 reducer + connect HOC + redux-persist），样板代码多
- Zustand 的 `persist` 中间件一行接入 localStorage，无需 PersistGate
- 单 store + 具名 actions，`useGameStore(s => s.xxx)` 订阅，无 Provider
- React 19 原生兼容，底层 `useSyncExternalStore`

### 为什么用 HashRouter

- 部署在 GitHub Pages 子路径 `/magiccard/`，无服务端 fallback 配置能力
- BrowserRouter 刷新会 404，HashRouter 用 URL hash 无此问题

### 为什么数据预编译为 JSON

- 原项目用 2.5MB 的 XML 字符串字面量，运行时用 `innerHTML` + `querySelectorAll` 解析，阻塞主线程数百毫秒
- 预编译为 JSON 后，运行时 `JSON.parse` 仅几十毫秒，且 bundle 体积更小
- 预建 `themeId→cards` 索引，避免每次查询全量遍历 14860 张卡

### 为什么图片用 `import.meta.env.BASE_URL` 拼接

- 部署到 GitHub Pages 子路径 `/magiccard/`，Vite `base` 配置为 `/magiccard/`
- Vite 自动给 CSS 背景图加 base 前缀，但 **JS 里手写的 `/assets` 字符串不会被改写**
- 用 `import.meta.env.BASE_URL`（dev 为 `/`，prod 为 `/magiccard/`）拼接，保证两种环境都正确

## 相关文档

- [状态管理](./STATE.md)
- [路由](./ROUTING.md)
- [数据层](./DATA.md)
- [UI 组件](./COMPONENTS.md)
- [PWA 与部署](./PWA_DEPLOY.md)
- [开发规范](./CONVENTIONS.md)
