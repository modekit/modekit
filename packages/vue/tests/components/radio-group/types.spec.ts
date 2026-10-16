import { expectTypeOf, it } from 'vitest'
import type { Component } from 'vue'

import type {
  RadioGroupEmits,
  RadioGroupItem,
  RadioGroupOrientation,
  RadioGroupProps,
  RadioGroupSize,
  RadioGroupVariant,
} from '../../../src/index.js'

it('exports typed Radio Group contracts', () => {
  expectTypeOf<RadioGroupSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
  expectTypeOf<RadioGroupVariant>().toEqualTypeOf<
    'default' | 'card' | 'table' | 'segmented' | 'pills'
  >()
  expectTypeOf<RadioGroupOrientation>().toEqualTypeOf<'vertical' | 'horizontal'>()
  expectTypeOf<RadioGroupItem>().toMatchObjectType<{
    label: string
    value: string | number
    description?: string
    icon?: Component
    disabled?: boolean
  }>()
  expectTypeOf<RadioGroupProps['modelValue']>().toEqualTypeOf<string | number | undefined>()
  expectTypeOf<RadioGroupEmits['update:modelValue']>().toEqualTypeOf<[value: string | number]>()
})
