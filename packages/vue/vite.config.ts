import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      include: ['src'],
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      cssFileName: 'styles',
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['reka-ui', 'vue'],
    },
    sourcemap: true,
  },
})
