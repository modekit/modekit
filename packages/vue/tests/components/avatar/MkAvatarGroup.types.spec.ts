import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  avatarGroupSpacings,
  type AvatarColor,
  type AvatarGroupAs,
  type AvatarGroupOverflowSlotProps,
  type AvatarGroupProps,
  type AvatarGroupSlots,
  type AvatarGroupSpacing,
  type AvatarGroupStyleConfig,
  type AvatarGroupUI,
  type AvatarSize,
  type ModeKitOptions,
} from '../../../src/index.js'

describe('Avatar Group contract', () => {
  it('defines the supported overlap spacing', () => {
    expect(avatarGroupSpacings).toEqual(['tight', 'normal', 'loose'])
    expectTypeOf<AvatarGroupSpacing>().toEqualTypeOf<'tight' | 'normal' | 'loose'>()
  })

  it('includes root, sizing, overflow, and styling options', () => {
    expectTypeOf<AvatarGroupProps['as']>().toEqualTypeOf<AvatarGroupAs | undefined>()
    expectTypeOf<AvatarGroupProps['size']>().toEqualTypeOf<AvatarSize | undefined>()
    expectTypeOf<AvatarGroupProps['spacing']>().toEqualTypeOf<AvatarGroupSpacing | undefined>()
    expectTypeOf<AvatarGroupProps['max']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<AvatarGroupProps['overflowColor']>().toEqualTypeOf<AvatarColor | undefined>()
    expectTypeOf<AvatarGroupProps['overflowLabel']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<AvatarGroupProps['ui']>().toEqualTypeOf<AvatarGroupUI | undefined>()
    expectTypeOf<AvatarGroupProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<NonNullable<AvatarGroupSlots['default']>>().toBeFunction()
    expectTypeOf<NonNullable<AvatarGroupSlots['overflow']>>().parameters.toEqualTypeOf<
      [props: AvatarGroupOverflowSlotProps]
    >()
  })

  it('types global Avatar Group slot and variant overrides', () => {
    expectTypeOf<AvatarGroupStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          size?: AvatarSize
          spacing?: AvatarGroupSpacing
          overflowColor?: AvatarColor
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['avatarGroup']>().toEqualTypeOf<
      AvatarGroupStyleConfig | undefined
    >()
  })
})
