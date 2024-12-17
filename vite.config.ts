import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // path 모듈 추가

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),   // '@'를 'src'로 매핑
      'src': path.resolve(__dirname, './src'), // 'src'도 정의
    },
  },
  define: {
    global: {}, // 브라우저 환경에서 global 변수를 정의
  },
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
      '/api/admin': {
        target: 'http://localhost:9090', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, '/admin'), // 경로 변경  
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