import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const typedFiles = ['packages/**/*.ts', 'packages/**/*.vue']

function forTypedFiles(config) {
  return {
    ...config,
    files: typedFiles,
  }
}

export default tseslint.config(
  {
    ignores: ['**/coverage/**', '**/dist/**', '**/node_modules/**', '**/playwright-report/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked.map(forTypedFiles),
  ...tseslint.configs.stylisticTypeChecked.map(forTypedFiles),
  ...vue.configs['flat/recommended'],
  {
    files: ['packages/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['packages/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettier,
)
