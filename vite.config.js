import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/desktop/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      "/api": {
        // 旧版
        // target: "http://120.26.126.129:8080",
        // 新版
        target: "http://115.29.177.149:8080",
        //本地测试
        // target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }

    }
  }
  ,
  build: {
    chunkSizeWarningLimit: 1000, // 提高警告阈值（临时方案）
    assetsInlineLimit: 4096,     // 4KB 以下资源转为 DataURL
    cssCodeSplit: true,         // 启用 CSS 代码分割
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',// 哈希化静态资源
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将每个第三方库独立分包（如 lodash → lodash.js）
            return id.toString().split('node_modules/')[1].split('/')[0]
          }
          // 将业务代码中的公共模块分组
          if (id.includes('src/utils')) return 'common-utils'
        }
      }
    }
  }
})
