import type { PropType } from 'vue'
import { computed, defineComponent, provide } from 'vue'

import type { ColorScheme, Contrast, Density, Platform, ThemeConfig } from '../theme/index.js'
import { defaultThemeConfig } from '../theme/index.js'
import { themeConfigKey } from './context.js'

export const ModeKitProvider = defineComponent({
  name: 'ModeKitProvider',
  props: {
    platform: {
      type: String as PropType<Platform>,
      default: defaultThemeConfig.platform,
    },
    colorScheme: {
      type: String as PropType<ColorScheme>,
      default: defaultThemeConfig.colorScheme,
    },
    density: {
      type: String as PropType<Density>,
      default: defaultThemeConfig.density,
    },
    contrast: {
      type: String as PropType<Contrast>,
      default: defaultThemeConfig.contrast,
    },
  },
  setup(props, { slots }) {
    const config = computed<Readonly<ThemeConfig>>(() => ({
      platform: props.platform,
      colorScheme: props.colorScheme,
      density: props.density,
      contrast: props.contrast,
    }))

    provide(themeConfigKey, config)

    return () => slots.default?.()
  },
})
