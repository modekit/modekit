import { describe, expectTypeOf, it } from 'vitest'

import type {
  FlexAlign,
  FlexBasis,
  FlexContentAlign,
  FlexDirection,
  FlexDisplay,
  FlexGap,
  FlexJustify,
  FlexOptions,
  FlexProps,
  FlexSelfAlign,
  FlexShorthand,
  FlexStyleConfig,
  FlexWrap,
} from '../../../src/index.js'

describe('flex type contracts', () => {
  it('exports container axis contracts', () => {
    expectTypeOf<'baseline'>().toExtend<FlexAlign>()
    expectTypeOf<'space-between'>().toExtend<FlexContentAlign>()
    expectTypeOf<'column-reverse'>().toExtend<FlexDirection>()
    expectTypeOf<'inline-flex'>().toExtend<FlexDisplay>()
    expectTypeOf<'space-evenly'>().toExtend<FlexJustify>()
    expectTypeOf<'wrap-reverse'>().toExtend<FlexWrap>()
  })

  it('exports gap and flex-item contracts', () => {
    expectTypeOf<readonly ['s', 20]>().toExtend<FlexGap>()
    expectTypeOf<'min-content'>().toExtend<FlexBasis>()
    expectTypeOf<readonly [2, 1, '30%']>().toExtend<FlexShorthand>()
    expectTypeOf<'auto'>().toExtend<FlexSelfAlign>()
  })

  it('keeps public options, slots, and native props compatible', () => {
    expectTypeOf<FlexProps>().toExtend<FlexOptions>()
    expectTypeOf<FlexProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<FlexProps['title']>().toEqualTypeOf<string | undefined>()
  })

  it('exports all global variant configuration axes', () => {
    expectTypeOf<{
      base?: string
      variants?: {
        direction?: { row?: string }
        justify?: { center?: string }
      }
      defaultVariants?: {
        display?: 'flex'
        wrap?: 'wrap'
      }
    }>().toExtend<FlexStyleConfig>()
  })
})
