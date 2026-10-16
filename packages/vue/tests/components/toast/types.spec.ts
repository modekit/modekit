import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  modeKitColors,
  toastColors,
  toastPositions,
  toastSwipeDirections,
  toastTypes,
  toastVariants,
  type ModeKitColor,
  type ModeKitOptions,
  type ToastActionData,
  type ToastActionSlotProps,
  type ToastApi,
  type ToastColor,
  type ToastData,
  type ToastId,
  type ToastInstance,
  type ToastEmits,
  type ToastPosition,
  type ToastProps,
  type ToastProviderProps,
  type ToastProviderSlots,
  type ToastProviderStyleConfig,
  type ToastSlots,
  type ToastStyleConfig,
  type ToastSwipeDirection,
  type ToastSwipeEvent,
  type ToastType,
  type ToastVariant,
} from '../../../src/index.js'

describe('Toast contract', () => {
  it('defines semantic treatments, positions, swipe directions, and announcement types', () => {
    expect(toastColors).toEqual(modeKitColors)
    expect(toastVariants).toEqual(['solid', 'soft', 'outline'])
    expect(toastPositions).toEqual(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
    expect(toastSwipeDirections).toEqual(['up', 'down', 'left', 'right'])
    expect(toastTypes).toEqual(['foreground', 'background'])
    expectTypeOf<ToastColor>().toEqualTypeOf<ModeKitColor>()
    expectTypeOf<ToastVariant>().toEqualTypeOf<'solid' | 'soft' | 'outline'>()
    expectTypeOf<ToastPosition>().toEqualTypeOf<
      'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    >()
    expectTypeOf<ToastSwipeDirection>().toEqualTypeOf<'up' | 'down' | 'left' | 'right'>()
    expectTypeOf<ToastType>().toEqualTypeOf<'foreground' | 'background'>()
  })

  it('types root state, content, actions, lifecycle events, and styling', () => {
    expectTypeOf<ToastProps['open']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ToastProps['duration']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<ToastProps['type']>().toEqualTypeOf<ToastType | undefined>()
    expectTypeOf<ToastProps['color']>().toEqualTypeOf<ToastColor | undefined>()
    expectTypeOf<ToastProps['variant']>().toEqualTypeOf<ToastVariant | undefined>()
    expectTypeOf<ToastProps['actions']>().toEqualTypeOf<readonly ToastActionData[] | undefined>()
    expectTypeOf<ToastProps['actionAltText']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ToastEmits['update:open']>().toEqualTypeOf<[value: boolean]>()
    expectTypeOf<ToastEmits['action']>().toEqualTypeOf<[event: MouseEvent]>()
    expectTypeOf<ToastEmits['swipeEnd']>().toEqualTypeOf<[event: ToastSwipeEvent]>()
    expectTypeOf<ToastData['id']>().toEqualTypeOf<ToastId | undefined>()
    expectTypeOf<ToastData['actions']>().toEqualTypeOf<readonly ToastActionData[] | undefined>()
    expectTypeOf<ToastApi['add']>().returns.toEqualTypeOf<ToastInstance>()
    expectTypeOf<ToastApi['remove']>().parameter(0).toEqualTypeOf<ToastId>()
    expectTypeOf<NonNullable<ToastSlots['action']>>()
      .parameter(0)
      .toEqualTypeOf<ToastActionSlotProps>()
  })

  it('types provider behavior, viewport configuration, and global options', () => {
    expectTypeOf<ToastProviderProps['duration']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<ToastProviderProps['swipeDirection']>().toEqualTypeOf<
      ToastSwipeDirection | undefined
    >()
    expectTypeOf<ToastProviderProps['position']>().toEqualTypeOf<ToastPosition | undefined>()
    expectTypeOf<ToastProviderProps['hotkey']>().toEqualTypeOf<string[] | undefined>()
    expectTypeOf<NonNullable<ToastProviderSlots['default']>>().toBeFunction()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['toast']>().toEqualTypeOf<
      ToastStyleConfig | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['toastProvider']>().toEqualTypeOf<
      ToastProviderStyleConfig | undefined
    >()
  })
})
