import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  avatarBadgePositions,
  avatarColors,
  avatarSizes,
  type AvatarAs,
  type AvatarBadgePosition,
  type AvatarColor,
  type AvatarEmits,
  type AvatarLoadingStatus,
  type AvatarProps,
  type AvatarSize,
  type AvatarSlots,
  type AvatarStyleConfig,
  type AvatarUI,
  type ModeKitOptions,
} from '../../../src/index.js'

describe('Avatar contract', () => {
  it('defines the supported colors, sizes, positions, and loading states', () => {
    expect(avatarColors).toEqual([
      'primary',
      'secondary',
      'success',
      'warning',
      'info',
      'destructive',
    ])
    expect(avatarSizes).toEqual(['xs', 'sm', 'md', 'lg', 'xl'])
    expect(avatarBadgePositions).toEqual(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
    expectTypeOf<AvatarColor>().toEqualTypeOf<
      'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive'
    >()
    expectTypeOf<AvatarSize>().toEqualTypeOf<'xs' | 'sm' | 'md' | 'lg' | 'xl'>()
    expectTypeOf<AvatarBadgePosition>().toEqualTypeOf<
      'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    >()
    expectTypeOf<AvatarLoadingStatus>().toEqualTypeOf<'idle' | 'loading' | 'loaded' | 'error'>()
  })

  it('includes root, image, fallback, shape, badge, and native options', () => {
    expectTypeOf<AvatarProps['as']>().toEqualTypeOf<AvatarAs | undefined>()
    expectTypeOf<AvatarProps['src']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarProps['alt']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarProps['fallback']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarProps['delayMs']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<AvatarProps['color']>().toEqualTypeOf<AvatarColor | undefined>()
    expectTypeOf<AvatarProps['size']>().toEqualTypeOf<AvatarSize | undefined>()
    expectTypeOf<AvatarProps['square']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<AvatarProps['badge']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<AvatarProps['badgeColor']>().toEqualTypeOf<AvatarColor | undefined>()
    expectTypeOf<AvatarProps['badgePosition']>().toEqualTypeOf<AvatarBadgePosition | undefined>()
    expectTypeOf<AvatarProps['ui']>().toEqualTypeOf<AvatarUI | undefined>()
    expectTypeOf<AvatarProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<NonNullable<AvatarSlots['default']>>().toBeFunction()
    expectTypeOf<AvatarEmits['loadingStatusChange']>().toEqualTypeOf<[value: AvatarLoadingStatus]>()
  })

  it('types global Avatar slot and variant overrides', () => {
    expectTypeOf<AvatarStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          color?: AvatarColor
          badgeColor?: AvatarColor
          size?: AvatarSize
          square?: boolean
          badgePosition?: AvatarBadgePosition
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['avatar']>().toEqualTypeOf<
      AvatarStyleConfig | undefined
    >()
  })
})
