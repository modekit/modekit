import { describe, expectTypeOf, it } from 'vitest'

import type {
  LabelProps,
  LabelSize,
  LabelStyleConfig,
  LabelUI,
  ModeKitOptions,
} from '../../../src/index.js'

describe('Label contract', () => {
  it('includes ModeKit options and native label attributes', () => {
    expectTypeOf<LabelProps['for']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<LabelProps['size']>().toEqualTypeOf<LabelSize | undefined>()
    expectTypeOf<LabelProps['required']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<LabelProps['ui']>().toEqualTypeOf<LabelUI | undefined>()
    expectTypeOf<LabelProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })

  it('types global sizes, slots, and defaults', () => {
    expectTypeOf<LabelStyleConfig['defaultVariants']>().toEqualTypeOf<
      { size?: LabelSize } | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['label']>().toEqualTypeOf<
      LabelStyleConfig | undefined
    >()
  })
})
