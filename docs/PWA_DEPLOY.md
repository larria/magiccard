# PWA 与部署

项目已改造为 PWA（可安装、离线可用），并部署到 GitHub Pages。

## PWA

使用 [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/)（基于 Workbox）自动生成 manifest 和 Service Worker。

### 配置

PWA 配置在 `vite.config.ts`：

```ts
VitePWA({
  registerType: 'autoUpdate',        // 自动更新
  base: basePath,                    // 跟随 Vite base（子路径适配）
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  manifest: {
    name: 'Magic Card 魔法卡牌',
    short_name: 'Magic Card',
    theme_color: '#1088e9',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: `${basePath}`,
    scope: `${basePath}`,
    icons: [/* pwa-192.png / pwa-512.png (含 maskable) */],
  },
  workbox: {
    // 只 precache app shell（HTML/JS/CSS），不缓存 678MB 卡牌图
    globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
    globIgnores: ['assets/card/**', 'assets/other/**', 'assets/style/**'],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    runtimeCaching: [
      {
        // 卡牌/主题/头像图按需缓存
        urlPattern: ({ url }) =>
          url.pathname.startsWith('/assets/') ||
          url.pathname.startsWith('/magiccard/assets/'),
        handler: 'CacheFirst',
        options: {
          cacheName: 'card-assets-cache',
          expiration: { maxEntries: 5000, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
})
```

### 缓存策略

| 资源 | 策略 | 说明 |
|---|---|---|
| HTML/JS/CSS | precache | app shell（约 3.3MB），SW 安装时缓存 |
| 卡牌/主题/头像图 | runtimeCaching（CacheFirst） | 678MB 全量 precache 不现实，按访问缓存，上限 5000 条 |

### PWA 图标

`public/` 下的图标由 `src/assets/logo.png` 用 macOS `sips` 生成：

```bash
sips -z 192 192 src/assets/logo.png --out public/pwa-192.png
sips -z 512 512 src/assets/logo.png --out public/pwa-512.png
sips -z 180 180 src/assets/logo.png --out public/apple-touch-icon.png
```

### 本地验证 PWA

`vite preview` 对子路径静态文件有 SPA fallback（会返回 HTML 而非 JS），无法验证 SW 注册。需用真实静态服务器模拟 GitHub Pages 路径：

```bash
BASE_PATH=/magiccard/ npm run build
mkdir -p /tmp/gh-sim && ln -sfn "$(pwd)/dist" /tmp/gh-sim/magiccard
cd /tmp/gh-sim && python3 -m http.server 4182
# 浏览器访问 http://localhost:4182/magiccard/，检查 SW 注册
```

## GitHub Pages 部署

### base 路径

GitHub Pages 服务在 `https://larria.github.io/magiccard/`（子路径），Vite `base` 必须为 `/magiccard/`。通过环境变量 `BASE_PATH` 区分环境：

- 本地 dev：`base: '/'`（`BASE_PATH` 未设，默认 `/`）
- 生产 build：`BASE_PATH=/magiccard/`

```ts
// vite.config.ts
const basePath = process.env.BASE_PATH || '/'
```

### 图片 URL 拼接

**关键**：Vite 的 `base` 会自动给 CSS 背景图和构建产物内的资源加前缀，但 **JS 里手写的字符串不会**。`getURL.ts`、`config.ts`、`PageRegister.tsx` 必须用 `import.meta.env.BASE_URL` 拼接：

```ts
// getURL.ts / config.ts
const BaseURL = `${import.meta.env.BASE_URL}assets`
// dev: '/assets'，prod: '/magiccard/assets'

// PageRegister.tsx
src={`${import.meta.env.BASE_URL}assets/style/imgs/moka_girl.png`}
```

`import.meta.env.BASE_URL` 由 Vite 注入，值等于 `base` 配置。

### 部署脚本

执行 `npm run deploy`（即 `scripts/deploy.sh`）：

1. `BASE_PATH=/magiccard/ npm run build` 构建产物到 `dist/`
2. 在 `dist` 内初始化独立 git 仓库，提交
3. `git push -f origin gh-pages` 推送到远程 `gh-pages` 分支
4. 清理 `dist/.git`

```bash
npm run deploy
```

### 为什么不用 gh-pages npm 包

`gh-pages` 包在 `git rm` 阶段会把所有要删除的文件路径作为命令行参数传入。本项目 `dist` 含近 4 万个文件，命令行参数超过系统 `E2BIG` 限制（macOS ARG_MAX）导致失败。改用脚本直接 git 推送规避此问题。

### 首次启用 Pages

部署后需在 GitHub 仓库设置启用 Pages（只需一次）：

1. 打开 https://github.com/larria/magiccard/settings/pages
2. **Source**：Deploy from a branch
3. **Branch**：选 `gh-pages`，目录 `/ (root)`，Save

启用后 1-2 分钟，站点在 https://larria.github.io/magiccard/ 生效。

### 更新部署

代码更新后重新执行 `npm run deploy` 即可，脚本会 `force push` 覆盖 `gh-pages` 分支。

## 本地预览生产构建

```bash
BASE_PATH=/magiccard/ npm run build
npx serve dist   # 或 python3 -m http.server（需配合子路径软链）
```

> 不要用 `npm run preview` 预览子路径构建——`vite preview` 对子路径静态文件有 SPA fallback，会返回 HTML 而非真实文件，导致 SW 注册失败、图片加载异常。
