import dotenv from 'dotenv';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

dotenv.config();

const {PORT = 3001} = process.env;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/socket.io': {
                target: `http://localhost:${PORT}`,
                changeOrigin: true,
            },
            '/api': {
                target: `http://localhost:${PORT}`,
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist/app',
    },
});
