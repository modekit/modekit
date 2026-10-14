import { describe, expectTypeOf, it } from 'vitest'

import type {
  ModeKitOptions,
  PopoverAlign,
  PopoverCollisionPadding,
  PopoverEmits,
  PopoverPortalTarget,
  PopoverPositionStrategy,
  PopoverProps,
  PopoverSide,
  PopoverSlotProps,
  PopoverSlots,
  PopoverStyleConfig,
  PopoverUI,
} from '../../../src/index.js'

describe('Popover contract', () => {
  it('includes state, positioning, native attributes, and ModeKit options', () => {
    expectTypeOf<PopoverProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<PopoverProps['side']>().toEqualTypeOf<PopoverSide | undefined>()
    expectTypeOf<PopoverProps['align']>().toEqualTypeOf<PopoverAlign | undefined>()
    expectTypeOf<PopoverProps['collisionPadding']>().toEqualTypeOf<
      PopoverCollisionPadding | undefined
    >()
    expectTypeOf<PopoverProps['positionStrategy']>().toEqualTypeOf<
      PopoverPositionStrategy | undefined
    >()
    expectTypeOf<PopoverProps['portal']>().toEqualTypeOf<PopoverPortalTarget | undefined>()
    expectTypeOf<PopoverProps['ui']>().toEqualTypeOf<PopoverUI | undefined>()
    expectTypeOf<PopoverProps['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<PopoverProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })

  it('types state updates, lifecycle events, slots, and global configuration', () => {
    expectTypeOf<PopoverEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<PopoverEmits['escapeKeyDown']>().toEqualTypeOf<[event: KeyboardEvent]>()
    expectTypeOf<PopoverSlotProps>().toEqualTypeOf<{ open: boolean; close: () => void }>()
    expectTypeOf<NonNullable<PopoverSlots['content']>>()
      .parameter(0)
      .toEqualTypeOf<PopoverSlotProps>()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['popover']>().toEqualTypeOf<
      PopoverStyleConfig | undefined
    >()
  })
})
