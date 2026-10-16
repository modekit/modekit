import { describe, expectTypeOf, it } from 'vitest'

import type {
  ModeKitOptions,
  SwitchAlignment,
  SwitchEmits,
  SwitchProps,
  SwitchSize,
  SwitchStyleConfig,
  SwitchUI,
  SwitchVariant,
} from '../../../src/index.js'

describe('Switch contract', () => {
  it('includes ModeKit options and native control attributes', () => {
    expectTypeOf<SwitchProps['modelValue']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<SwitchProps['size']>().toEqualTypeOf<SwitchSize | undefined>()
    expectTypeOf<SwitchProps['variant']>().toEqualTypeOf<SwitchVariant | undefined>()
    expectTypeOf<SwitchProps['align']>().toEqualTypeOf<SwitchAlignment | undefined>()
    expectTypeOf<SwitchProps['loading']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<SwitchProps['ui']>().toEqualTypeOf<SwitchUI | undefined>()
    expectTypeOf<SwitchProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<SwitchProps['id']>().toEqualTypeOf<string | undefined>()
  })

  it('types model updates, global slots, sizes, and defaults', () => {
    expectTypeOf<SwitchEmits['update:modelValue']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<SwitchStyleConfig['defaultVariants']>().toEqualTypeOf<
      { size?: SwitchSize; variant?: SwitchVariant; align?: SwitchAlignment } | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['switch']>().toEqualTypeOf<
      SwitchStyleConfig | undefined
    >()
  })
})
