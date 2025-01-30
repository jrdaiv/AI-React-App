import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // ✅ Ensures correct relative paths
  build: {
    outDir: 'dist'  // ✅ Ensures Vercel finds the build folder
  }
});
