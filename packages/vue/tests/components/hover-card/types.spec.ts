import { describe, expectTypeOf, it } from 'vitest'

import type {
  HoverCardAlign,
  HoverCardCollisionPadding,
  HoverCardEmits,
  HoverCardPortalTarget,
  HoverCardPositionStrategy,
  HoverCardProps,
  HoverCardSide,
  HoverCardSlotProps,
  HoverCardSlots,
  HoverCardStyleConfig,
  HoverCardUI,
  ModeKitOptions,
} from '../../../src/index.js'

describe('Hover Card contract', () => {
  it('includes timing, touch, positioning, native attributes, and ModeKit options', () => {
    expectTypeOf<HoverCardProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<HoverCardProps['openDelay']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<HoverCardProps['closeDelay']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<HoverCardProps['enableTouch']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<HoverCardProps['side']>().toEqualTypeOf<HoverCardSide | undefined>()
    expectTypeOf<HoverCardProps['align']>().toEqualTypeOf<HoverCardAlign | undefined>()
    expectTypeOf<HoverCardProps['collisionPadding']>().toEqualTypeOf<
      HoverCardCollisionPadding | undefined
    >()
    expectTypeOf<HoverCardProps['positionStrategy']>().toEqualTypeOf<
      HoverCardPositionStrategy | undefined
    >()
    expectTypeOf<HoverCardProps['portal']>().toEqualTypeOf<HoverCardPortalTarget | undefined>()
    expectTypeOf<HoverCardProps['ui']>().toEqualTypeOf<HoverCardUI | undefined>()
    expectTypeOf<HoverCardProps['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<HoverCardProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })

  it('types state updates, lifecycle events, slots, and global configuration', () => {
    expectTypeOf<HoverCardEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<HoverCardEmits['escapeKeyDown']>().toEqualTypeOf<[event: KeyboardEvent]>()
    expectTypeOf<HoverCardSlotProps>().toEqualTypeOf<{ open: boolean }>()
    expectTypeOf<NonNullable<HoverCardSlots['content']>>()
      .parameter(0)
      .toEqualTypeOf<HoverCardSlotProps>()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['hoverCard']>().toEqualTypeOf<
      HoverCardStyleConfig | undefined
    >()
  })
})
