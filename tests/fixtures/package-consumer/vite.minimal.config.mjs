import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist-minimal',
    rollupOptions: {
      input: fileURLToPath(new URL('./minimal.html', import.meta.url)),
    },
  },
})
