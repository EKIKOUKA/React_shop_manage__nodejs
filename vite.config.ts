import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/shop_sample/',
    plugins: [react()],
    server: {
        proxy: {
            '/shop_sample/api': {
                target: 'http://localhost:3000', // Express 後端本地地址
                changeOrigin: true,
                rewrite: path => path.replace(/^\/shop_sample\/api/, '') // 若你的後端是 '/api/login' 這種結構
            }
        }
    }
})
