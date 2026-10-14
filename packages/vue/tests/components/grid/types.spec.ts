import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  gridAlignments,
  gridDisplays,
  gridSpacePresets,
  gridSpecialMargins,
  type GridAlign,
  type GridAs,
  type GridDisplay,
  type GridGap,
  type GridLayoutOptions,
  type GridOptions,
  type GridProps,
  type GridSlots,
  type GridStyleConfig,
  type GridUI,
  type ModeKitOptions,
} from '../../../src/index.js'

describe('Grid contract', () => {
  it('defines the supported finite layout values', () => {
    expect(gridAlignments).toEqual(['start', 'center', 'baseline', 'end', 'stretch'])
    expect(gridDisplays).toEqual(['none', 'grid', 'inline-grid'])
    expect(gridSpacePresets).toEqual(['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'])
    expect(gridSpecialMargins).toEqual(['none', 'auto', 'auto-inline', 'auto-block'])
    expectTypeOf<GridAlign>().toEqualTypeOf<'start' | 'center' | 'baseline' | 'end' | 'stretch'>()
    expectTypeOf<GridDisplay>().toEqualTypeOf<'none' | 'grid' | 'inline-grid'>()
  })

  it('includes root, tracks, gaps, alignment, and styling options', () => {
    expectTypeOf<GridProps['as']>().toEqualTypeOf<GridAs | undefined>()
    expectTypeOf<GridProps['columns']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<GridProps['minColWidth']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<GridProps['gap']>().toEqualTypeOf<GridGap | undefined>()
    expectTypeOf<GridProps['align']>().toEqualTypeOf<GridAlign | undefined>()
    expectTypeOf<GridProps['display']>().toEqualTypeOf<GridDisplay | undefined>()
    expectTypeOf<GridProps['ui']>().toEqualTypeOf<GridUI | undefined>()
    expectTypeOf<GridProps['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<NonNullable<GridSlots['default']>>().toBeFunction()
  })

  it('includes the VKUI-inspired logical layout props', () => {
    expectTypeOf<GridOptions>().toExtend<GridLayoutOptions>()
    expectTypeOf<GridProps['marginInline']>().toEqualTypeOf<GridLayoutOptions['marginInline']>()
    expectTypeOf<GridProps['paddingBlock']>().toEqualTypeOf<GridLayoutOptions['paddingBlock']>()
    expectTypeOf<GridProps['inlineSize']>().toEqualTypeOf<GridLayoutOptions['inlineSize']>()
    expectTypeOf<GridProps['position']>().toEqualTypeOf<GridLayoutOptions['position']>()
    expectTypeOf<GridProps['overflowBlock']>().toEqualTypeOf<GridLayoutOptions['overflowBlock']>()
    expectTypeOf<GridProps['flexGrow']>().toEqualTypeOf<GridLayoutOptions['flexGrow']>()
  })

  it('types global Grid alignment and display overrides', () => {
    expectTypeOf<GridStyleConfig['defaultVariants']>().toEqualTypeOf<
      | {
          align?: GridAlign
          display?: GridDisplay
        }
      | undefined
    >()
    expectTypeOf<NonNullable<ModeKitOptions['ui']>['grid']>().toEqualTypeOf<
      GridStyleConfig | undefined
    >()
  })
})
