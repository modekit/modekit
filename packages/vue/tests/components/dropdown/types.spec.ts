import { describe, expectTypeOf, it } from 'vitest'

import type {
  DropdownCheckboxItem,
  DropdownCheckboxItemEmits,
  DropdownCheckboxItemProps,
  DropdownCollisionPadding,
  DropdownEmits,
  DropdownFilterEmits,
  DropdownItem,
  DropdownItemEmits,
  DropdownItemProps,
  DropdownItemSlotProps,
  DropdownProps,
  DropdownRadioGroupEmits,
  DropdownRadioGroupItem,
  DropdownRadioItemProps,
  DropdownSelectableItem,
  DropdownSubmenuItem,
  DropdownSlotProps,
  DropdownSlots,
  DropdownStyleConfig,
  DropdownSubContentProps,
  DropdownSubEmits,
  DropdownUI,
  DropdownValue,
  ModeKitColor,
  ModeKitOptions,
} from '../../../src/index.js'

describe('Dropdown contract', () => {
  it('types root state, positioning, native attributes, slots, and configuration', () => {
    expectTypeOf<DropdownProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<DropdownProps['collisionPadding']>().toEqualTypeOf<
      DropdownCollisionPadding | undefined
    >()
    expectTypeOf<DropdownProps['ui']>().toEqualTypeOf<DropdownUI | undefined>()
    expectTypeOf<DropdownProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<DropdownEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<DropdownEmits['itemSelect']>().toEqualTypeOf<
      [item: DropdownSelectableItem, index: number, event: Event]
    >()
    expectTypeOf<DropdownProps['items']>().toEqualTypeOf<readonly DropdownItem[] | undefined>()
    expectTypeOf<DropdownCheckboxItem>().toExtend<DropdownItem>()
    expectTypeOf<DropdownRadioGroupItem>().toExtend<DropdownItem>()
    expectTypeOf<DropdownSubmenuItem>().toExtend<DropdownItem>()
    expectTypeOf<DropdownSlotProps>().toEqualTypeOf<{ open: boolean }>()
    expectTypeOf<NonNullable<DropdownSlots['content']>>()
      .parameter(0)
      .toEqualTypeOf<DropdownSlotProps>()
    expectTypeOf<NonNullable<DropdownSlots['item']>>()
      .parameter(0)
      .toEqualTypeOf<DropdownItemSlotProps>()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['dropdown']>().toEqualTypeOf<
      DropdownStyleConfig | undefined
    >()
  })

  it('types actions, checkbox, radio, filtering, and submenu contracts', () => {
    expectTypeOf<DropdownItemProps['color']>().toEqualTypeOf<ModeKitColor | undefined>()
    expectTypeOf<DropdownItemEmits['select']>().toEqualTypeOf<[event: Event]>()
    expectTypeOf<DropdownCheckboxItemProps['modelValue']>().toEqualTypeOf<
      boolean | 'indeterminate' | undefined
    >()
    expectTypeOf<DropdownCheckboxItemEmits['update:modelValue']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<DropdownRadioItemProps['value']>().toEqualTypeOf<DropdownValue>()
    expectTypeOf<DropdownRadioGroupEmits['update:modelValue']>().toEqualTypeOf<
      [value: DropdownValue]
    >()
    expectTypeOf<DropdownFilterEmits['update:modelValue']>().toEqualTypeOf<[value: string]>()
    expectTypeOf<DropdownSubEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<DropdownSubContentProps['positionStrategy']>().toEqualTypeOf<
      'absolute' | 'fixed' | undefined
    >()
  })
})
