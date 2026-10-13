import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import ComponentPreview from '../components/ComponentPreview.vue'
import ComponentsOverview from '../components/ComponentsOverview.vue'
import PrimaryColorSwitcher from '../components/PrimaryColorSwitcher.vue'
import '../../../vue/src/styles.css'
import './preview.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ComponentPreview', ComponentPreview)
    app.component('ComponentsOverview', ComponentsOverview)
    app.component('PrimaryColorSwitcher', PrimaryColorSwitcher)
  },
} satisfies Theme
