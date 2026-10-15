import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    clearMocks: true,
    environment: 'jsdom',
    exclude: ['tests/browser/**'],
    include: ['tests/**/*.spec.ts'],
    restoreMocks: true,
  },
})
