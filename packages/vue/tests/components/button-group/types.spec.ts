import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  buttonGroupOrientations,
  type ButtonGroupAs,
  type ButtonGroupOrientation,
  type ButtonGroupProps,
  type ButtonGroupSlots,
  type ButtonGroupStyleConfig,
  type ButtonGroupUI,
  type ModeKitOptions,
} from '../../../src/index.js'

describe('Button Group contract', () => {
  it('defines the supported orientations', () => {
    expect(buttonGroupOrientations).toEqual(['horizontal', 'vertical'])
    expectTypeOf<ButtonGroupOrientation>().toEqualTypeOf<'horizontal' | 'vertical'>()
  })

  it('includes root, orientation, accessibility, and styling options', () => {
    expectTypeOf<ButtonGroupProps['as']>().toEqualTypeOf<ButtonGroupAs | undefined>()
    expectTypeOf<ButtonGroupProps['orientation']>().toEqualTypeOf<
      ButtonGroupOrientation | undefined
    >()
    expectTypeOf<ButtonGroupProps['ui']>().toEqualTypeOf<ButtonGroupUI | undefined>()
    expectTypeOf<ButtonGroupProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<NonNullable<ButtonGroupSlots['default']>>().toBeFunction()
  })

  it('types global Button Group orientation overrides', () => {
    expectTypeOf<ButtonGroupStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          orientation?: ButtonGroupOrientation
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['buttonGroup']>().toEqualTypeOf<
      ButtonGroupStyleConfig | undefined
    >()
  })
})
