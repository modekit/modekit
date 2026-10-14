import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    dts({
      beforeWriteFile: (filePath) => (filePath.endsWith('/preflight.d.ts') ? false : undefined),
      copyDtsFiles: true,
      entryRoot: 'src',
      exclude: ['src/preflight.css'],
      include: ['src'],
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        preflight: 'src/preflight.css',
      },
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['reka-ui', 'vue'],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.names.includes('index.css') ? 'styles.css' : '[name][extname]',
      },
    },
    sourcemap: true,
  },
})
