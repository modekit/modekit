import { describe, expect, it } from 'vitest'

import {
  colorSchemes,
  contrasts,
  defaultThemeConfig,
  densities,
  platforms,
} from '../../src/index.js'

describe('theme config', () => {
  it('exposes the supported values', () => {
    expect(platforms).toEqual(['web', 'ios', 'android'])
    expect(colorSchemes).toEqual(['light', 'dark'])
    expect(densities).toEqual(['comfortable', 'compact'])
    expect(contrasts).toEqual(['normal', 'high'])
  })

  it('uses supported, immutable defaults', () => {
    expect(platforms).toContain(defaultThemeConfig.platform)
    expect(colorSchemes).toContain(defaultThemeConfig.colorScheme)
    expect(densities).toContain(defaultThemeConfig.density)
    expect(contrasts).toContain(defaultThemeConfig.contrast)
    expect(Object.isFrozen(defaultThemeConfig)).toBe(true)
  })
})
