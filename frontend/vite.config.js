import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
                 strategies: 'injectManifest',

      // 👇 THIS enables ./src/sw.js
      srcDir: 'src',
      filename: 'sw.js',

            includeAssets: [
                'favicon.ico',
                'favicon-16x16.png',
                'favicon-32x32.png',
                'apple-touch-icon.png',
                'safari-pinned-tab.svg',
                'mstile-144x144.png'
            ],
            manifest: {
                name: 'Higura Decor',
                short_name: 'Higura Decor',
                description: 'Professional inventory management application for businesses',
                theme_color: '#0ea5e9',
                background_color: '#f0f9ff',
                display: 'standalone',
                orientation: 'portrait-primary',
                start_url: '/',
                scope: '/',
                categories: ['business', 'productivity', 'utilities'],
                prefer_related_applications: false,
                lang: 'en',
                dir: 'ltr',
                icons: [
                    {
                        src: '/higura_logo.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/higura_logo.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/higura_logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/higura_logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
                screenshots: [
                    {
                        src: '/screenshots/desktop.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'Desktop view of Higura Decor'
                    },
                    {
                        src: '/screenshots/mobile.png',
                        sizes: '375x812',
                        type: 'image/png',
                        form_factor: 'narrow',
                        label: 'Mobile view of Higura Decor'
                    }
                ]
            },
                   injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}'],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
},
            devOptions: {
                enabled: true,
                type: 'module',
                navigateFallback: 'index.html'
            }
        })
    ],
    optimizeDeps: {
        exclude: ['axios'],
        include: ['react', 'react-dom', 'lucide-react']
    },
    build: {
        target: 'es2015',
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    },
    server: {
        host: true, // Allows access from network for testing on mobile devices
        port: 5173
    }
})