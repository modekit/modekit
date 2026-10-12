import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import ComponentPreview from '../components/ComponentPreview.vue'
import './preview.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ComponentPreview', ComponentPreview)
  },
} satisfies Theme
