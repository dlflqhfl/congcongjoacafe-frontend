// vite.config.ts
import { defineConfig } from "file:///C:/Users/user/Desktop/congcongjoacafe-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/user/Desktop/congcongjoacafe-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    proxy: {
      "/user/register/duplicate": {
        target: "http://localhost:9090",
        // Spring Boot 서버의 주소
        changeOrigin: true,
        // 요청의 origin을 target 서버로 변경
        rewrite: (path) => path.replace(/^\/user/, "")
        // 경로 변경 (선택 사항)
      },
      "/admin": {
        target: "http://localhost:9090",
        // Spring Boot 서버의 주소
        changeOrigin: true
        // 요청의 origin을 target 서버로 변경
      }
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcY29uZ2Nvbmdqb2FjYWZlLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcY29uZ2Nvbmdqb2FjYWZlLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy91c2VyL0Rlc2t0b3AvY29uZ2Nvbmdqb2FjYWZlLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy91c2VyL3JlZ2lzdGVyL2R1cGxpY2F0ZSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjkwOTAnLCAvLyBTcHJpbmcgQm9vdCBcdUMxMUNcdUJDODRcdUM3NTggXHVDOEZDXHVDMThDXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAgLy8gXHVDNjk0XHVDQ0FEXHVDNzU4IG9yaWdpblx1Qzc0NCB0YXJnZXQgXHVDMTFDXHVCQzg0XHVCODVDIFx1QkNDMFx1QUNCRFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC91c2VyLywgJycpLCAvLyBcdUFDQkRcdUI4NUMgXHVCQ0MwXHVBQ0JEIChcdUMxMjBcdUQwREQgXHVDMEFDXHVENTZEKVxyXG4gICAgICB9LFxyXG4gICAgICAnL2FkbWluJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6OTA5MCcsIC8vIFNwcmluZyBCb290IFx1QzExQ1x1QkM4NFx1Qzc1OCBcdUM4RkNcdUMxOENcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsICAvLyBcdUM2OTRcdUNDQURcdUM3NTggb3JpZ2luXHVDNzQ0IHRhcmdldCBcdUMxMUNcdUJDODRcdUI4NUMgXHVCQ0MwXHVBQ0JEXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddXHJcbiAgfVxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1UsU0FBUyxvQkFBb0I7QUFDblcsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCw0QkFBNEI7QUFBQSxRQUMxQixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFdBQVcsRUFBRTtBQUFBO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
