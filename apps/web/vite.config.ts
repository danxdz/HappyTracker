import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom'],
          
          // State management
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          
          // Routing
          'router-vendor': ['react-router-dom'],
          
          // UI libraries
          'ui-vendor': ['framer-motion', 'lucide-react'],
          
          // 3D libraries
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          
          // AI/ML libraries
          'ai-vendor': ['face-api.js'],
          
          // Utility libraries
          'utils-vendor': ['clsx', 'class-variance-authority']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})