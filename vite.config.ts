import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/shop_sample/',
    plugins: [react()],
    optimizeDeps: {
        include: ['antd']
    },
    server: {
        proxy: {
            '/shop_sample/java_api': { // Java Spring Boot
                target: 'http://localhost:8080',
                // target: 'https://www.makotodeveloper.website',
                changeOrigin: true
            },
            '/shop_sample/nodejs_api': { // Node.js
                target: 'http://localhost:3000',
                changeOrigin: true
    	    }
        }
    }
})
