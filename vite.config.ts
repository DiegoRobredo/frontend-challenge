/// <reference types="vitest" />

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    resolve: {
        alias: {
            '@': '/src',
            '@/components': '/src/components',
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
    plugins: [tsconfigPaths()],
})
