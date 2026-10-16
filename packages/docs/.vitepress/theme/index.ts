import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import ComponentPreview from '../components/ComponentPreview.vue'
import ComponentsOverview from '../components/ComponentsOverview.vue'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import ModeKitLayout from './ModeKitLayout.vue'
import '@fontsource-variable/bricolage-grotesque'
import '../../../vue/src/styles.css'
import './preview.css'
import './theme.css'

export default {
  extends: DefaultTheme,
  Layout: ModeKitLayout,
  enhanceApp({ app }) {
    app.component('ComponentPreview', ComponentPreview)
    app.component('ComponentsOverview', ComponentsOverview)
    app.component('ThemeSwitcher', ThemeSwitcher)
  },
} satisfies Theme
