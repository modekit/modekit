export const platforms = ['web', 'ios', 'android'] as const
export const colorSchemes = ['light', 'dark'] as const
export const densities = ['comfortable', 'compact'] as const
export const contrasts = ['normal', 'high'] as const

export type Platform = (typeof platforms)[number]
export type ColorScheme = (typeof colorSchemes)[number]
export type Density = (typeof densities)[number]
export type Contrast = (typeof contrasts)[number]

export interface ThemeConfig {
  platform: Platform
  colorScheme: ColorScheme
  density: Density
  contrast: Contrast
}

export const defaultThemeConfig: Readonly<ThemeConfig> = Object.freeze({
  platform: 'web',
  colorScheme: 'light',
  density: 'comfortable',
  contrast: 'normal',
})
