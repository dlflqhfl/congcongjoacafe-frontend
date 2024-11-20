import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/user/register/duplicate': {
        target: 'http://localhost:9090', // Spring Boot 서버의 주소
        changeOrigin: true,  // 요청의 origin을 target 서버로 변경
        rewrite: (path) => path.replace(/^\/user/, ''), // 경로 변경 (선택 사항)
      },
      '/admin': {
        target: 'http://localhost:9090', // Spring Boot 서버의 주소
        changeOrigin: true,  // 요청의 origin을 target 서버로 변경
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
})