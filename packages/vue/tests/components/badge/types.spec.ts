import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  badgeColors,
  badgeSizes,
  badgeVariants,
  modeKitColors,
  type BadgeAs,
  type BadgeColor,
  type BadgeCompoundVariant,
  type BadgeProps,
  type BadgeSize,
  type BadgeStyleConfig,
  type BadgeUI,
  type BadgeVariant,
  type ModeKitOptions,
  type ModeKitColor,
} from '../../../src/index.js'

describe('Badge contract', () => {
  it('defines the supported colors, variants, and sizes', () => {
    expect(badgeColors).toEqual(modeKitColors)
    expectTypeOf<BadgeColor>().toEqualTypeOf<ModeKitColor>()
    expect(badgeVariants).toEqual(['default', 'soft', 'outline', 'subtle'])
    expectTypeOf<BadgeVariant>().toEqualTypeOf<'default' | 'soft' | 'outline' | 'subtle'>()
    expect(badgeSizes).toEqual(['sm', 'md', 'lg'])
    expectTypeOf<BadgeSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
  })

  it('includes ModeKit options, root composition, and native attributes', () => {
    expectTypeOf<BadgeProps['as']>().toEqualTypeOf<BadgeAs | undefined>()
    expectTypeOf<BadgeProps['color']>().toEqualTypeOf<BadgeColor | undefined>()
    expectTypeOf<BadgeProps['variant']>().toEqualTypeOf<BadgeVariant | undefined>()
    expectTypeOf<BadgeProps['size']>().toEqualTypeOf<BadgeSize | undefined>()
    expectTypeOf<BadgeProps['rounded']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<BadgeProps['ui']>().toEqualTypeOf<BadgeUI | undefined>()
    expectTypeOf<BadgeProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<BadgeProps['id']>().toEqualTypeOf<string | undefined>()
  })

  it('types global Badge axes, compounds, and defaults', () => {
    expectTypeOf<BadgeStyleConfig['compoundVariants']>().toEqualTypeOf<
      readonly BadgeCompoundVariant[] | undefined
    >()
    expectTypeOf<BadgeStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          color?: BadgeColor
          variant?: BadgeVariant
          size?: BadgeSize
          rounded?: boolean
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['badge']>().toEqualTypeOf<
      BadgeStyleConfig | undefined
    >()
  })
})
