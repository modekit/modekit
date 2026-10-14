import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  createModeKit,
  MkCaption,
  MkEllipsisText,
  MkHeadline,
  MkLink,
  MkMark,
  MkParagraph,
  MkText,
} from '../../../src/index.js'

describe('typography components', () => {
  it('renders semantic, visually independent headlines with the neutral-800 default', () => {
    const wrapper = mount(MkHeadline, {
      props: { as: 'h1', size: 'sm', variant: 'display', id: 'page-title' },
      slots: { default: 'Dashboard' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('H1')
    expect(wrapper.attributes('id')).toBe('page-title')
    expect(wrapper.attributes('data-mk-size')).toBe('sm')
    expect(wrapper.attributes('data-mk-variant')).toBe('display')
    expect(wrapper.attributes('data-mk-primary')).toBeUndefined()
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-headline',
        'mk:text-sm',
        'mk:text-neutral-800',
        'mk:font-bold',
        'mk:leading-none',
      ]),
    )
  })

  it.each([
    ['xs', 'mk:text-xs'],
    ['sm', 'mk:text-sm'],
    ['md', 'mk:text-base'],
    ['lg', 'mk:text-lg'],
    ['xl', 'mk:text-xl'],
    ['2xl', 'mk:text-2xl'],
    ['3xl', 'mk:text-3xl'],
    ['4xl', 'mk:text-4xl'],
    ['5xl', 'mk:text-5xl'],
    ['6xl', 'mk:text-6xl'],
    ['7xl', 'mk:text-7xl'],
    ['8xl', 'mk:text-8xl'],
    ['9xl', 'mk:text-9xl'],
  ] as const)('maps the %s Headline size directly to its Tailwind text size', (size, className) => {
    const wrapper = mount(MkHeadline, {
      props: { size },
      slots: { default: 'Direct size mapping' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toContain(className)
  })

  it('uses neutral-500 for body typography defaults', () => {
    const text = mount(MkText, { slots: { default: 'Inline text' } })
    const paragraph = mount(MkParagraph, { slots: { default: 'Paragraph text' } })
    const caption = mount(MkCaption, { slots: { default: 'Caption text' } })

    expect((text.element as HTMLElement).tagName).toBe('SPAN')
    expect(text.classes()).toEqual(
      expect.arrayContaining(['mk-text', 'mk:text-base', 'mk:text-neutral-500']),
    )
    expect((paragraph.element as HTMLElement).tagName).toBe('P')
    expect(paragraph.classes()).toEqual(
      expect.arrayContaining(['mk-paragraph', 'mk:leading-7', 'mk:text-neutral-500']),
    )
    expect((caption.element as HTMLElement).tagName).toBe('SPAN')
    expect(caption.classes()).toEqual(
      expect.arrayContaining(['mk-caption', 'mk:text-xs', 'mk:text-neutral-500']),
    )
  })

  it('offers one boolean primary treatment instead of arbitrary colors', () => {
    const headline = mount(MkHeadline, { props: { primary: true } })
    const text = mount(MkText, { props: { primary: true } })
    const paragraph = mount(MkParagraph, { props: { primary: true } })

    for (const wrapper of [headline, text, paragraph]) {
      expect(wrapper.attributes('data-mk-primary')).toBe('true')
      expect(wrapper.classes()).toContain('mk:text-primary')
      expect(wrapper.attributes('data-mk-color')).toBeUndefined()
    }
  })

  it.each([
    [1, ['mk:truncate']],
    [2, ['mk:[-webkit-line-clamp:2]']],
    [3, ['mk:[-webkit-line-clamp:3]']],
    [4, ['mk:[-webkit-line-clamp:4]']],
  ] as const)('composes EllipsisText through Text and clamps to %s line(s)', (lines, classes) => {
    const wrapper = mount(MkEllipsisText, {
      props: { as: 'p', lines, title: 'Full content' },
      slots: { default: 'Long content' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('P')
    expect(wrapper.attributes('data-mk-lines')).toBe(String(lines))
    expect(wrapper.attributes('title')).toBe('Full content')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mk-text', 'mk-ellipsis-text', 'mk:text-neutral-500', ...classes]),
    )
  })

  it.each([
    ['soft', ['mk:bg-neutral-100', 'mk:text-neutral-500']],
    ['solid', ['mk:bg-neutral-800', 'mk:text-white']],
    ['outline', ['mk:border', 'mk:border-solid', 'mk:border-neutral-300']],
  ] as const)('composes the neutral %s Mark treatment through Text', (variant, classes) => {
    const wrapper = mount(MkMark, { props: { variant } })

    expect((wrapper.element as HTMLElement).tagName).toBe('MARK')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mk-text', 'mk-mark', ...classes]))
  })

  it('applies the primary Mark treatment through the same boolean prop', () => {
    const wrapper = mount(MkMark, { props: { primary: true, variant: 'soft' } })

    expect(wrapper.attributes('data-mk-primary')).toBe('true')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mk-text', 'mk-mark', 'mk:bg-primary/10', 'mk:text-primary']),
    )
  })

  it.each([
    ['underline', ['mk:underline']],
    ['hover', ['mk:no-underline', 'mk:hover:underline']],
    ['plain', ['mk:no-underline']],
  ] as const)('renders the %s Link treatment with native attributes', (variant, classes) => {
    const wrapper = mount(MkLink, {
      props: { href: '/docs', target: '_blank', rel: 'noreferrer', variant },
      slots: { default: 'Documentation' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/docs')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noreferrer')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mk:text-neutral-500', ...classes]))
  })

  it('applies component defaults and override layers from createModeKit', () => {
    const wrapper = mount(MkHeadline, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              headline: {
                base: 'tracking-normal',
                variants: {
                  size: { lg: 'text-5xl' },
                  variant: { display: 'leading-tight' },
                  primary: { true: 'underline' },
                },
                defaultVariants: { size: 'lg', variant: 'display', primary: true },
              },
            },
          }),
        ],
      },
      props: { ui: { base: 'font-medium' }, class: 'custom-headline' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-variant')).toBe('display')
    expect(wrapper.attributes('data-mk-primary')).toBe('true')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'tracking-normal',
        'text-5xl',
        'leading-tight',
        'underline',
        'font-medium',
        'custom-headline',
      ]),
    )
  })
})
