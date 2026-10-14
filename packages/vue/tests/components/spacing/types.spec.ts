import { describe, expectTypeOf, it } from 'vitest'

import type {
  SpacingCSSVariable,
  SpacingOptions,
  SpacingOrientation,
  SpacingPreset,
  SpacingProps,
  SpacingSize,
  SpacingStyleConfig,
} from '../../../src/index.js'

describe('spacing type contracts', () => {
  it('exports the preset and custom-property size contracts', () => {
    expectTypeOf<'4xl'>().toExtend<SpacingPreset>()
    expectTypeOf<'--section-gap'>().toExtend<SpacingCSSVariable>()
    expectTypeOf<'var(--section-gap)'>().toExtend<SpacingCSSVariable>()
    expectTypeOf<32>().toExtend<SpacingSize>()
    expectTypeOf<'full'>().toExtend<SpacingSize>()
    expectTypeOf<'horizontal'>().toExtend<SpacingOrientation>()
  })

  it('keeps the public options and native props compatible', () => {
    expectTypeOf<SpacingProps>().toExtend<SpacingOptions>()
    expectTypeOf<SpacingProps['title']>().toEqualTypeOf<string | undefined>()
  })

  it('keeps growing and fixed spacing mutually exclusive', () => {
    expectTypeOf<{ grow: true }>().toExtend<SpacingProps>()
    expectTypeOf<{ orientation: 'horizontal'; size: 'l' }>().toExtend<SpacingProps>()
    expectTypeOf<{ grow: true; size: 'l' }>().not.toExtend<SpacingProps>()
    expectTypeOf<{ grow: true; orientation: 'horizontal' }>().not.toExtend<SpacingProps>()
  })

  it('exports the global style configuration', () => {
    expectTypeOf<{ base?: string }>().toExtend<SpacingStyleConfig>()
  })
})
