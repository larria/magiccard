import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// GitHub Pages 部署在子路径 /magiccard/，本地开发用根路径。
// 通过环境变量 BASE_PATH 控制：构建时传 BASE_PATH=/magiccard/ 即可。
const basePath = process.env.BASE_PATH || '/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 子路径部署：manifest 与 SW 的 start_url/scope 跟随 base
      base: basePath,
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Magic Card 魔法卡牌',
        short_name: 'Magic Card',
        description: '卡牌收集 / 合成 / 变卡游戏',
        theme_color: '#1088e9',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: `${basePath}`,
        scope: `${basePath}`,
        icons: [
          {
            src: `${basePath}pwa-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${basePath}pwa-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${basePath}pwa-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // 卡牌图片资源达 678M，不能 precache，只缓存 app shell（HTML/JS/CSS）
        // 图标（pwa-192/512、apple-touch-icon）通过 includeAssets 纳入
        // 卡牌 / 主题 / 头像图通过 runtimeCaching 按需缓存
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // 排除 public/assets 下的大体量卡牌图，确保不进入 precache
        globIgnores: ['assets/card/**', 'assets/other/**', 'assets/style/**'],
        runtimeCaching: [
          {
            // 卡牌 / 主题 / 头像等静态图片按需缓存
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/') || url.pathname.startsWith('/magiccard/assets/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'card-assets-cache',
              expiration: {
                // 卡牌图数量大，但单张小；限制条数与时长
                maxEntries: 5000,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
})
