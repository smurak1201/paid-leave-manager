import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://172.22.227.254:8000',
        target: 'https://xs209049.xsrv.jp/paid-leave-manager',
        changeOrigin: true,
      },
    },
  },
})
