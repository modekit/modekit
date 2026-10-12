import { describe, expect, expectTypeOf, it } from 'vitest'

import type { ButtonProps, ButtonSize, ButtonType, ButtonVariant } from '../../../src/index.js'
import { buttonSizes, buttonTypes, buttonVariants } from '../../../src/index.js'

describe('Button contract', () => {
  it('defines the supported variants and native button types', () => {
    expect(buttonVariants).toEqual(['primary', 'secondary', 'tertiary', 'destructive'])
    expect(buttonSizes).toEqual(['sm', 'md', 'lg'])
    expect(buttonTypes).toEqual(['button', 'submit', 'reset'])
  })

  it('includes ModeKit options and native button attributes', () => {
    expectTypeOf<ButtonProps['variant']>().toEqualTypeOf<ButtonVariant | undefined>()
    expectTypeOf<ButtonProps['size']>().toEqualTypeOf<ButtonSize | undefined>()
    expectTypeOf<ButtonProps['type']>().toEqualTypeOf<ButtonType | undefined>()
    expectTypeOf<ButtonProps['loading']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ButtonProps['name']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<ButtonProps['value']>().toEqualTypeOf<
      string | number | readonly string[] | undefined
    >()
  })
})
