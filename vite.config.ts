import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // 서버 시작 시 브라우저가 자동으로 열리도록 설정
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/user/register/duplicat': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, ''),
      },
      '/admin': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist', // 빌드시 출력 디렉토리
    sourcemap: true, // 디버깅을 위한 소스맵 생성
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // 번들에서 제외할 패키지
  },
})