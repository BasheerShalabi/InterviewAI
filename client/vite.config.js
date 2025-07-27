import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://192.168.28.128:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // optional, depending on your API rout
      },
      '/socket.io': {
        target: 'http://192.168.28.128:8000',
        ws: true, // <== IMPORTANT for WebSocket
        changeOrigin: true,
      },
    }
}
}
)
