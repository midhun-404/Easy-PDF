import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ['pdf-lib', 'pdfjs-dist', 'jspdf'],
          word: ['docx', 'mammoth'],
          ocr: ['tesseract.js'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['tesseract.js']
  }
});