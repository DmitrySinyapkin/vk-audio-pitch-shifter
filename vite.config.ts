import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      protocol: 'wss', 
      host: 'localhost'
    }
  },
  plugins: [
    react(),
    basicSsl(),
  ],
})
