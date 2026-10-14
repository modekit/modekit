import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  separatorOrientations,
  separatorPositions,
  separatorSizes,
  separatorTypes,
  type ModeKitOptions,
  type SeparatorAs,
  type SeparatorCompoundVariant,
  type SeparatorOrientation,
  type SeparatorPosition,
  type SeparatorProps,
  type SeparatorSize,
  type SeparatorStyleConfig,
  type SeparatorType,
  type SeparatorUI,
} from '../../../src/index.js'

describe('Separator contract', () => {
  it('defines the supported finite axes', () => {
    expect(separatorSizes).toEqual(['sm', 'md', 'lg'])
    expect(separatorTypes).toEqual(['solid', 'dashed', 'dotted'])
    expect(separatorOrientations).toEqual(['horizontal', 'vertical'])
    expect(separatorPositions).toEqual(['start', 'center', 'end'])
    expectTypeOf<SeparatorSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
    expectTypeOf<SeparatorType>().toEqualTypeOf<'solid' | 'dashed' | 'dotted'>()
    expectTypeOf<SeparatorOrientation>().toEqualTypeOf<'horizontal' | 'vertical'>()
    expectTypeOf<SeparatorPosition>().toEqualTypeOf<'start' | 'center' | 'end'>()
  })

  it('includes composition, content, style, and native attributes', () => {
    expectTypeOf<SeparatorProps['as']>().toEqualTypeOf<SeparatorAs | undefined>()
    expectTypeOf<SeparatorProps['label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<SeparatorProps['primary']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<SeparatorProps['size']>().toEqualTypeOf<SeparatorSize | undefined>()
    expectTypeOf<SeparatorProps['type']>().toEqualTypeOf<SeparatorType | undefined>()
    expectTypeOf<SeparatorProps['orientation']>().toEqualTypeOf<SeparatorOrientation | undefined>()
    expectTypeOf<SeparatorProps['position']>().toEqualTypeOf<SeparatorPosition | undefined>()
    expectTypeOf<SeparatorProps['ui']>().toEqualTypeOf<SeparatorUI | undefined>()
    expectTypeOf<SeparatorProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<SeparatorProps['id']>().toEqualTypeOf<string | undefined>()
  })

  it('types global Separator slots, axes, compounds, and defaults', () => {
    expectTypeOf<SeparatorStyleConfig['compoundVariants']>().toEqualTypeOf<
      readonly SeparatorCompoundVariant[] | undefined
    >()
    expectTypeOf<SeparatorStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          primary?: boolean
          size?: SeparatorSize
          type?: SeparatorType
          orientation?: SeparatorOrientation
          position?: SeparatorPosition
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['separator']>().toEqualTypeOf<
      SeparatorStyleConfig | undefined
    >()
  })
})
