import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  ButtonColor,
  ButtonCompoundVariant,
  ButtonProps,
  ButtonSize,
  ButtonStyleConfig,
  ButtonType,
  ButtonUI,
  ButtonVariant,
  ModeKitOptions,
} from '../../../src/index.js'
import { buttonColors, buttonSizes, buttonTypes, buttonVariants } from '../../../src/index.js'

describe('Button contract', () => {
  it('defines the supported colors, variants, sizes, and native button types', () => {
    expect(buttonColors).toEqual([
      'primary',
      'secondary',
      'muted',
      'success',
      'warning',
      'info',
      'destructive',
    ])
    expectTypeOf<ButtonColor>().toEqualTypeOf<
      'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'info' | 'destructive'
    >()
    expect(buttonVariants).toEqual(['default', 'outline', 'soft', 'subtle', 'ghost', 'link'])
    expect(buttonSizes).toEqual(['xs', 'sm', 'md', 'lg'])
    expect(buttonTypes).toEqual(['button', 'submit', 'reset'])
  })

  it('includes ModeKit options and native button attributes', () => {
    expectTypeOf<ButtonProps['color']>().toEqualTypeOf<ButtonColor | undefined>()
    expectTypeOf<ButtonProps['variant']>().toEqualTypeOf<ButtonVariant | undefined>()
    expectTypeOf<ButtonProps['size']>().toEqualTypeOf<ButtonSize | undefined>()
    expectTypeOf<ButtonProps['type']>().toEqualTypeOf<ButtonType | undefined>()
    expectTypeOf<ButtonProps['loading']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonProps['square']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonProps['ui']>().toEqualTypeOf<ButtonUI | undefined>()
    expectTypeOf<ButtonProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ButtonProps['name']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ButtonProps['value']>().toEqualTypeOf<
      string | number | readonly string[] | undefined
    >()
  })

  it('types global Button axes, compounds, and defaults', () => {
    expectTypeOf<ButtonStyleConfig['compoundVariants']>().toEqualTypeOf<
      readonly ButtonCompoundVariant[] | undefined
    >()
    expectTypeOf<ButtonStyleConfig['defaultVariants']>().toEqualTypeOf<
      { color?: ButtonColor; variant?: ButtonVariant; size?: ButtonSize } | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['button']>().toEqualTypeOf<
      ButtonStyleConfig | undefined
    >()
  })
})
