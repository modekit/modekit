import { describe, expectTypeOf, it } from 'vitest'

import type {
  CheckboxEmits,
  CheckboxProps,
  CheckboxSize,
  CheckboxState,
  CheckboxStyleConfig,
  CheckboxUI,
  CheckboxVariant,
  ModeKitOptions,
} from '../../../src/index.js'

describe('Checkbox contract', () => {
  it('includes ModeKit options and native control attributes', () => {
    expectTypeOf<CheckboxProps['modelValue']>().toEqualTypeOf<CheckboxState | undefined>()
    expectTypeOf<CheckboxProps['size']>().toEqualTypeOf<CheckboxSize | undefined>()
    expectTypeOf<CheckboxProps['variant']>().toEqualTypeOf<CheckboxVariant | undefined>()
    expectTypeOf<CheckboxProps['ui']>().toEqualTypeOf<CheckboxUI | undefined>()
    expectTypeOf<CheckboxProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<CheckboxProps['aria-invalid']>().toEqualTypeOf<
      boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined
    >()
    expectTypeOf<CheckboxProps['id']>().toEqualTypeOf<string | undefined>()
  })

  it('types model updates, global slots, sizes, and defaults', () => {
    expectTypeOf<CheckboxEmits['update:modelValue']>().toEqualTypeOf<[value: CheckboxState]>()
    expectTypeOf<CheckboxStyleConfig['defaultVariants']>().toEqualTypeOf<
      { size?: CheckboxSize; variant?: CheckboxVariant } | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['checkbox']>().toEqualTypeOf<
      CheckboxStyleConfig | undefined
    >()
  })
})
