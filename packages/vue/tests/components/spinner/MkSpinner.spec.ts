import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { createModeKit, MkSpinner } from '../../../src/index.js'

describe('MkSpinner', () => {
  it('renders an accessible status indicator with safe defaults', () => {
    const wrapper = mount(MkSpinner)

    expect((wrapper.element as HTMLElement).tagName).toBe('SPAN')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.classes()).toContain('mk:size-4')
    expect(wrapper.classes()).toContain('mk:animate-spin')
    expect(wrapper.classes()).toContain('mk:motion-reduce:animate-none')
    expect(wrapper.classes()).toContain('mk:box-border')
    expect(wrapper.classes()).toContain('mk:border-solid')
    expect(wrapper.classes()).toContain('mk:border-current')
    expect(wrapper.classes()).toContain('mk:border-r-transparent')
  })

  it.each([
    ['xs', 'mk:size-3'],
    ['sm', 'mk:size-3.5'],
    ['md', 'mk:size-4'],
    ['lg', 'mk:size-5'],
  ] as const)('exposes the %s size', (size, sizeClass) => {
    const wrapper = mount(MkSpinner, { props: { size } })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toContain(sizeClass)
  })

  it('allows decorative use without conflicting status semantics', () => {
    const wrapper = mount(MkSpinner, {
      props: { 'aria-hidden': 'true' },
    })

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('forwards native attributes and resolves class overrides in order', () => {
    const wrapper = mount(MkSpinner, {
      props: {
        size: 'sm',
        title: 'Synchronizing',
        ui: { base: 'size-6 text-emerald-600' },
        class: 'sync-state size-8',
      },
    })

    expect(wrapper.attributes('title')).toBe('Synchronizing')
    expect(wrapper.classes()).toContain('sync-state')
    expect(wrapper.classes()).toContain('size-8')
    expect(wrapper.classes()).toContain('text-emerald-600')
    expect(wrapper.classes()).not.toContain('size-6')
    expect(wrapper.classes()).toContain('mk:size-3.5')
  })

  it('applies global size overrides and defaults from the Vue plugin', () => {
    const wrapper = mount(MkSpinner, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              spinner: {
                base: 'text-violet-600',
                variants: {
                  size: {
                    lg: 'size-7',
                  },
                },
                defaultVariants: {
                  size: 'lg',
                },
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.classes()).toContain('text-violet-600')
    expect(wrapper.classes()).toContain('size-7')
    expect(wrapper.classes()).toContain('mk:size-5')
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkSpinner>[0]['aria-label']>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Parameters<typeof MkSpinner>[0]['title']>().toEqualTypeOf<string | undefined>()
  })
})
