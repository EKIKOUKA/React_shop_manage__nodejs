import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/shop_sample/',
    plugins: [react()],
    server: {
        proxy: {
            '/shop_sample/api': {
                target: 'https://www.makotodeveloper.website',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/shop_sample\/api/, '/shop_sample/api')

            }
        }
    }
})
