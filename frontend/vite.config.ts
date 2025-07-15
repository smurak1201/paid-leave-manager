import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  // base: '/paid-leave-manager/', //本番設定
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', //ローカル設定
        // target: 'https://xs209049.xsrv.jp/paid-leave-manager', //本番設定
        changeOrigin: true,
      },
    },
  },
})
