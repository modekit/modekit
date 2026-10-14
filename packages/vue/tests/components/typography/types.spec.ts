import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  captionSizes,
  captionVariants,
  ellipsisLines,
  headlineSizes,
  headlineVariants,
  inlineTextSizes,
  linkVariants,
  markVariants,
  paragraphVariants,
  textSizes,
  textVariants,
  typographyAlignments,
  typographyWeights,
  type EllipsisTextProps,
  type HeadlineProps,
  type LinkProps,
  type MarkProps,
  type ModeKitOptions,
  type TextProps,
} from '../../../src/index.js'

describe('typography contract', () => {
  it('exports curated finite scales and treatments', () => {
    expect(headlineSizes).toEqual(['xs', 'sm', 'md', 'lg', 'xl', '2xl'])
    expect(textSizes).toEqual(['xs', 'sm', 'md', 'lg', 'xl'])
    expect(captionSizes).toEqual(['xs', 'sm', 'md'])
    expect(inlineTextSizes).toEqual(['inherit', 'xs', 'sm', 'md', 'lg', 'xl'])
    expect(headlineVariants).toEqual(['default', 'display'])
    expect(textVariants).toEqual(['default', 'label'])
    expect(paragraphVariants).toEqual(['default', 'lead'])
    expect(captionVariants).toEqual(['default', 'uppercase'])
    expect(markVariants).toEqual(['soft', 'solid', 'outline'])
    expect(linkVariants).toEqual(['underline', 'hover', 'plain'])
    expect(ellipsisLines).toEqual([1, 2, 3, 4])
    expect(typographyWeights).toEqual(['inherit', 'normal', 'medium', 'semibold', 'bold'])
    expect(typographyAlignments).toEqual(['inherit', 'left', 'center', 'right', 'justify'])
  })

  it('keeps semantic elements, visual sizes, primary treatment, and native attributes typed independently', () => {
    expectTypeOf<HeadlineProps['as']>().toEqualTypeOf<
      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | import('vue').Component | undefined
    >()
    expectTypeOf<HeadlineProps['primary']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<'color' extends keyof TextProps ? true : false>().toEqualTypeOf<false>()
    expectTypeOf<EllipsisTextProps['lines']>().toEqualTypeOf<1 | 2 | 3 | 4 | undefined>()
    expectTypeOf<LinkProps['href']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<LinkProps['target']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<MarkProps['title']>().toEqualTypeOf<string | undefined>()
  })

  it('registers every typography component in global configuration', () => {
    type UI = NonNullable<ModeKitOptions['ui']>
    expectTypeOf<UI['headline']>().not.toBeNever()
    expectTypeOf<UI['text']>().not.toBeNever()
    expectTypeOf<UI['paragraph']>().not.toBeNever()
    expectTypeOf<UI['caption']>().not.toBeNever()
    expectTypeOf<UI['ellipsisText']>().not.toBeNever()
    expectTypeOf<UI['mark']>().not.toBeNever()
    expectTypeOf<UI['link']>().not.toBeNever()
  })
})
