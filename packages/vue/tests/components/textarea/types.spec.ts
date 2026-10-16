import { describe, expectTypeOf, it } from 'vitest'

import type {
  TextareaEmits,
  TextareaOptions,
  TextareaProps,
  TextareaResize,
  TextareaSize,
  TextareaStyleConfig,
  TextareaUI,
  TextareaValue,
  TextareaVariant,
} from '../../../src/index.js'

describe('Textarea types', () => {
  it('exports the public value and finite-axis contracts', () => {
    expectTypeOf<TextareaValue>().toEqualTypeOf<string | number>()
    expectTypeOf<TextareaSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
    expectTypeOf<TextareaVariant>().toEqualTypeOf<
      'outline' | 'soft' | 'subtle' | 'ghost' | 'plain'
    >()
    expectTypeOf<TextareaResize>().toEqualTypeOf<'none' | 'vertical' | 'horizontal' | 'both'>()
  })

  it('exports native-compatible component, styling, and event contracts', () => {
    expectTypeOf<TextareaProps>().toExtend<TextareaOptions>()
    expectTypeOf<TextareaProps>().toHaveProperty('rows')
    expectTypeOf<TextareaProps>().toHaveProperty('maxlength')
    expectTypeOf<TextareaProps>().toHaveProperty('wrap')
    expectTypeOf<TextareaUI>().toHaveProperty('textarea')
    expectTypeOf<TextareaStyleConfig>().toHaveProperty('defaultVariants')
    expectTypeOf<TextareaEmits['update:modelValue']>().toEqualTypeOf<[value: string]>()
  })
})
