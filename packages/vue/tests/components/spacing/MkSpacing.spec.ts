import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { createModeKit, MkSpacing, spacingOrientations, spacingSizes } from '../../../src/index.js'

describe('MkSpacing', () => {
  it('renders a decorative transparent block with the default spacing', () => {
    const wrapper = mount(MkSpacing)

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('data-mk-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-mk-size')).toBe('m')
    expect((wrapper.element as HTMLElement).style.blockSize).toBe('0.75rem')
    expect(wrapper.classes()).toContain('mk-spacing')
    expect(wrapper.classes()).toContain('mk:block')
    expect(wrapper.classes()).toContain('mk:shrink-0')
  })

  it.each([
    ['2xs', '0.125rem'],
    ['xs', '0.25rem'],
    ['s', '0.5rem'],
    ['m', '0.75rem'],
    ['l', '1rem'],
    ['xl', '1.5rem'],
    ['2xl', '2rem'],
    ['3xl', '2.5rem'],
    ['4xl', '3rem'],
  ] as const)('resolves the %s preset', (size, expectedSize) => {
    const wrapper = mount(MkSpacing, { props: { size } })

    expect((wrapper.element as HTMLElement).style.blockSize).toBe(expectedSize)
  })

  it('resolves non-negative pixel sizes', () => {
    const wrapper = mount(MkSpacing, { props: { size: 32 } })

    expect(wrapper.attributes('data-mk-size')).toBe('32')
    expect((wrapper.element as HTMLElement).style.blockSize).toBe('32px')
  })

  it.each([
    ['--section-gap', 'var(--section-gap)'],
    ['var(--section-gap)', 'var(--section-gap)'],
  ] as const)('resolves the %s custom property', (size, expectedSize) => {
    const wrapper = mount(MkSpacing, { props: { size } })

    expect((wrapper.element as HTMLElement).style.blockSize).toBe(expectedSize)
  })

  it('creates horizontal spacing with logical inline size', () => {
    const wrapper = mount(MkSpacing, {
      props: { orientation: 'horizontal', size: 'xl' },
    })

    expect(wrapper.attributes('data-mk-orientation')).toBe('horizontal')
    expect((wrapper.element as HTMLElement).style.inlineSize).toBe('1.5rem')
    expect((wrapper.element as HTMLElement).style.blockSize).toBe('')
  })

  it.each([
    ['vertical', 'blockSize'],
    ['horizontal', 'inlineSize'],
  ] as const)('fills the %s axis', (orientation, property) => {
    const wrapper = mount(MkSpacing, {
      props: { orientation, size: 'full' },
    })

    expect((wrapper.element as HTMLElement).style[property]).toBe('100%')
  })

  it('grows into the remaining space of a flex container', () => {
    const wrapper = mount(MkSpacing, { props: { grow: true } })
    const style = (wrapper.element as HTMLElement).style

    expect(wrapper.attributes('data-mk-grow')).toBe('true')
    expect(wrapper.attributes('data-mk-orientation')).toBeUndefined()
    expect(wrapper.attributes('data-mk-size')).toBeUndefined()
    expect(style.flex).toBe('1 1 0%')
    expect(style.minBlockSize).toBe('0px')
    expect(style.minInlineSize).toBe('0px')
    expect(style.blockSize).toBe('')
    expect(style.inlineSize).toBe('')
  })

  it('does not render slot content', () => {
    const wrapper = mount(MkSpacing, {
      slots: { default: 'This content must not render' },
    })

    expect(wrapper.text()).toBe('')
    expect((wrapper.element as HTMLElement).children).toHaveLength(0)
  })

  it('forwards native attributes and resolves class and style overrides', () => {
    const wrapper = mount(MkSpacing, {
      props: {
        id: 'section-space',
        ui: { base: 'bg-neutral-100' },
        class: 'custom-spacing w-1/2',
        style: { blockSize: '5rem' },
      },
    })

    expect(wrapper.attributes('id')).toBe('section-space')
    expect(wrapper.classes()).toContain('custom-spacing')
    expect(wrapper.classes()).toContain('w-1/2')
    expect(wrapper.classes()).toContain('bg-neutral-100')
    expect((wrapper.element as HTMLElement).style.blockSize).toBe('5rem')
  })

  it('applies the global base override', () => {
    const wrapper = mount(MkSpacing, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              spacing: { base: 'bg-violet-100' },
            },
          }),
        ],
      },
    })

    expect(wrapper.classes()).toContain('bg-violet-100')
  })

  it('exports all spacing presets and orientations', () => {
    expect(spacingSizes).toEqual(['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'])
    expect(spacingOrientations).toEqual(['vertical', 'horizontal'])
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkSpacing>[0]['aria-label']>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Parameters<typeof MkSpacing>[0]['title']>().toEqualTypeOf<string | undefined>()
  })
})
