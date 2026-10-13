import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  calloutColors,
  calloutSizes,
  calloutVariants,
  type CalloutAs,
  type CalloutCloseSlotProps,
  type CalloutColor,
  type CalloutEmits,
  type CalloutProps,
  type CalloutSize,
  type CalloutSlots,
  type CalloutStyleConfig,
  type CalloutTitleSlotProps,
  type CalloutUI,
  type CalloutVariant,
  type ModeKitOptions,
} from '../../../src/index.js'

describe('Callout contract', () => {
  it('defines supported semantic colors, treatments, and sizes', () => {
    expect(calloutColors).toEqual([
      'primary',
      'secondary',
      'muted',
      'success',
      'warning',
      'info',
      'destructive',
    ])
    expect(calloutVariants).toEqual(['solid', 'soft', 'outline'])
    expect(calloutSizes).toEqual(['sm', 'md', 'lg'])
    expectTypeOf<CalloutColor>().toEqualTypeOf<
      'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'info' | 'destructive'
    >()
    expectTypeOf<CalloutVariant>().toEqualTypeOf<'solid' | 'soft' | 'outline'>()
    expectTypeOf<CalloutSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
  })

  it('includes root, content, dismissal, and styling options', () => {
    expectTypeOf<CalloutProps['as']>().toEqualTypeOf<CalloutAs | undefined>()
    expectTypeOf<CalloutProps['color']>().toEqualTypeOf<CalloutColor | undefined>()
    expectTypeOf<CalloutProps['variant']>().toEqualTypeOf<CalloutVariant | undefined>()
    expectTypeOf<CalloutProps['size']>().toEqualTypeOf<CalloutSize | undefined>()
    expectTypeOf<CalloutProps['title']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<CalloutProps['dismissible']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<CalloutProps['dismissLabel']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<CalloutProps['ui']>().toEqualTypeOf<CalloutUI | undefined>()
    expectTypeOf<CalloutProps['role']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<CalloutEmits['close']>().toEqualTypeOf<[event: MouseEvent]>()
  })

  it('types named content slots and their props', () => {
    expectTypeOf<NonNullable<CalloutSlots['icon']>>().toBeFunction()
    expectTypeOf<NonNullable<CalloutSlots['title']>>().parameters.toEqualTypeOf<
      [props: CalloutTitleSlotProps]
    >()
    expectTypeOf<NonNullable<CalloutSlots['default']>>().toBeFunction()
    expectTypeOf<NonNullable<CalloutSlots['actions']>>().toBeFunction()
    expectTypeOf<NonNullable<CalloutSlots['close']>>().parameters.toEqualTypeOf<
      [props: CalloutCloseSlotProps]
    >()
  })

  it('types global Callout slot, axis, compound, and default overrides', () => {
    expectTypeOf<CalloutStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          color?: CalloutColor
          variant?: CalloutVariant
          size?: CalloutSize
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['callout']>().toEqualTypeOf<
      CalloutStyleConfig | undefined
    >()
  })
})
