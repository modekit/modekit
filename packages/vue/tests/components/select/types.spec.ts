import { describe, expectTypeOf, it } from 'vitest'

import type {
  SelectAlign,
  SelectCollisionPadding,
  SelectDirection,
  SelectEmits,
  SelectGroup,
  SelectItem,
  SelectItemSlotProps,
  SelectModelValue,
  SelectOption,
  SelectOptions,
  SelectPortalTarget,
  SelectPosition,
  SelectPositionStrategy,
  SelectProps,
  SelectSeparator,
  SelectSide,
  SelectSize,
  SelectSlotProps,
  SelectSlots,
  SelectStyleConfig,
  SelectUI,
  SelectValue,
  SelectValueSlotProps,
  SelectVariant,
} from '../../../src/index.js'

describe('Select types', () => {
  it('exports curated public axes and item contracts', () => {
    expectTypeOf<SelectSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
    expectTypeOf<SelectVariant>().toEqualTypeOf<'outline' | 'soft' | 'subtle' | 'ghost' | 'plain'>()
    expectTypeOf<SelectSide>().toEqualTypeOf<'top' | 'right' | 'bottom' | 'left'>()
    expectTypeOf<SelectAlign>().toEqualTypeOf<'start' | 'center' | 'end'>()
    expectTypeOf<SelectPosition>().toEqualTypeOf<'popper' | 'item-aligned'>()
    expectTypeOf<SelectPositionStrategy>().toEqualTypeOf<'absolute' | 'fixed'>()
    expectTypeOf<SelectDirection>().toEqualTypeOf<'ltr' | 'rtl'>()
    expectTypeOf<SelectValue>().toEqualTypeOf<string | number>()
    expectTypeOf<SelectModelValue>().toEqualTypeOf<SelectValue | readonly SelectValue[]>()
    expectTypeOf<SelectItem>().toEqualTypeOf<SelectOption | SelectGroup | SelectSeparator>()
    expectTypeOf<SelectCollisionPadding>().toEqualTypeOf<
      number | Partial<Record<SelectSide, number>>
    >()
    expectTypeOf<SelectPortalTarget>().toEqualTypeOf<boolean | string | HTMLElement>()
  })

  it('exports component, styling, event, and slot contracts', () => {
    expectTypeOf<SelectProps>().toExtend<SelectOptions>()
    expectTypeOf<SelectUI>().toHaveProperty('content')
    expectTypeOf<SelectStyleConfig>().toHaveProperty('defaultVariants')
    expectTypeOf<SelectEmits['update:modelValue']>().toEqualTypeOf<[value: SelectModelValue]>()
    expectTypeOf<SelectEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<SelectEmits['itemSelect']>().toEqualTypeOf<
      [item: SelectOption, index: number, event: Event]
    >()
    expectTypeOf<NonNullable<SelectSlots['value']>>().toBeFunction()
    expectTypeOf<NonNullable<SelectSlots['item']>>().toBeFunction()
    expectTypeOf<NonNullable<SelectSlots['empty']>>().toBeFunction()
    expectTypeOf<SelectSlotProps>().toHaveProperty('selectedItems')
    expectTypeOf<SelectValueSlotProps>().toHaveProperty('placeholder')
    expectTypeOf<SelectItemSlotProps>().toHaveProperty('selected')
  })
})
