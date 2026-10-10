import type { InjectionKey, Ref } from 'vue'
import { inject, shallowRef } from 'vue'

import type { ThemeConfig } from '../theme/index.js'
import { defaultThemeConfig } from '../theme/index.js'

export type ThemeConfigRef = Readonly<Ref<Readonly<ThemeConfig>>>

export const themeConfigKey: InjectionKey<ThemeConfigRef> = Symbol('modekit-theme-config')

const fallbackThemeConfig: ThemeConfigRef = shallowRef(defaultThemeConfig)

export function useThemeConfig(): ThemeConfigRef {
  return inject(themeConfigKey, fallbackThemeConfig)
}
