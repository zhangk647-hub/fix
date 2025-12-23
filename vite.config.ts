import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      // 优化静态资源路径配置，确保在各种环境下正确访问
      base: './', // 使用相对路径，确保在任何域名下都能正确加载资源
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            // 使用相对路径，适配 GitHub Pages 子路径部署
            navigateFallback: './index.html',
            // 确保 Service Worker 范围正确
            cleanupOutdatedCaches: true,
            skipWaiting: true,
            clientsClaim: true
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'jia_512.png'],
          manifest: {
            name: '海信日立空调维修查询',
            short_name: '空调维修',
            description: '海信日立空调维修查询应用',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: './', // 使用相对路径
            scope: './', // Service Worker 作用域
            icons: [
              {
                src: 'jia_512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: 'jia_512.png',
                sizes: '192x192',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});