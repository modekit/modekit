import { describe, expectTypeOf, it } from 'vitest'

import type {
  ModeKitOptions,
  TooltipAlign,
  TooltipCollisionPadding,
  TooltipEmits,
  TooltipPortalTarget,
  TooltipPositionStrategy,
  TooltipProps,
  TooltipProviderProps,
  TooltipProviderSlots,
  TooltipSide,
  TooltipSlotProps,
  TooltipSlots,
  TooltipStyleConfig,
  TooltipUI,
} from '../../../src/index.js'

describe('Tooltip contract', () => {
  it('includes state, timing, positioning, native attributes, and ModeKit options', () => {
    expectTypeOf<TooltipProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<TooltipProps['delayDuration']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<TooltipProps['side']>().toEqualTypeOf<TooltipSide | undefined>()
    expectTypeOf<TooltipProps['align']>().toEqualTypeOf<TooltipAlign | undefined>()
    expectTypeOf<TooltipProps['collisionPadding']>().toEqualTypeOf<
      TooltipCollisionPadding | undefined
    >()
    expectTypeOf<TooltipProps['positionStrategy']>().toEqualTypeOf<
      TooltipPositionStrategy | undefined
    >()
    expectTypeOf<TooltipProps['portal']>().toEqualTypeOf<TooltipPortalTarget | undefined>()
    expectTypeOf<TooltipProps['ui']>().toEqualTypeOf<TooltipUI | undefined>()
    expectTypeOf<TooltipProps['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<TooltipProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })

  it('types state updates, lifecycle events, slots, provider, and global configuration', () => {
    expectTypeOf<TooltipEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<TooltipEmits['escapeKeyDown']>().toEqualTypeOf<[event: KeyboardEvent]>()
    expectTypeOf<TooltipSlotProps>().toEqualTypeOf<{ open: boolean }>()
    expectTypeOf<NonNullable<TooltipSlots['content']>>()
      .parameter(0)
      .toEqualTypeOf<TooltipSlotProps>()
    expectTypeOf<TooltipProviderProps['skipDelayDuration']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<NonNullable<TooltipProviderSlots['default']>>().returns.toEqualTypeOf<
      ReturnType<NonNullable<TooltipProviderSlots['default']>>
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['tooltip']>().toEqualTypeOf<
      TooltipStyleConfig | undefined
    >()
  })
})
