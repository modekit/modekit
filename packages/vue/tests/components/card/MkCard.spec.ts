import { mount } from '@vue/test-utils'
import { Primitive } from 'reka-ui'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { cardBodies, cardSizes, cardVariants, createModeKit, MkCard } from '../../../src/index.js'

describe('MkCard', () => {
  it('renders a neutral div container with safe defaults', () => {
    const wrapper = mount(MkCard, {
      slots: { default: 'Card content' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('data-mk-variant')).toBe('default')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-body')).toBe('seamless')
    expect(wrapper.classes()).toContain('mk:rounded-2xl')
    expect(wrapper.classes()).toContain('mk:border')
    expect(wrapper.classes()).toContain('mk:border-solid')
    expect(wrapper.classes()).toContain('mk:border-border')
    expect(wrapper.classes()).toContain('mk:bg-surface')
    expect(wrapper.classes()).toContain('mk:text-surface-foreground')
    expect(wrapper.classes()).toContain('mk:shadow-sm')
    expect(wrapper.classes()).toContain('mk:p-6')
    expect(wrapper.get('.mk-card__body').text()).toBe('Card content')
    expect(wrapper.get('.mk-card__body').classes()).not.toContain('mk:border')
  })

  it('renders through the Reka UI Primitive', () => {
    const wrapper = mount(MkCard)

    expect(wrapper.findComponent(Primitive).exists()).toBe(true)
    expect(wrapper.attributes('as')).toBeUndefined()
  })

  it.each([
    ['sm', ['mk:-mx-3', 'mk:rounded-lg', 'mk:p-4']],
    ['md', ['mk:-mx-5', 'mk:rounded-xl', 'mk:p-5']],
    ['lg', ['mk:-mx-7', 'mk:rounded-xl', 'mk:p-6']],
  ] as const)('renders an inset body panel at the %s size', (size, classes) => {
    const wrapper = mount(MkCard, {
      props: { body: 'inset', size },
      slots: { default: 'Inset content' },
    })

    const body = wrapper.get('.mk-card__body')

    expect(wrapper.attributes('data-mk-body')).toBe('inset')
    expect(body.classes()).toEqual(
      expect.arrayContaining([
        'mk:border',
        'mk:border-solid',
        'mk:border-border',
        'mk:bg-muted',
        'mk:shadow-inner',
        ...classes,
      ]),
    )
  })

  it('raises an inset body from a muted outer surface', () => {
    const wrapper = mount(MkCard, {
      props: { body: 'inset', variant: 'muted' },
      slots: { default: 'Raised content' },
    })

    const body = wrapper.get('.mk-card__body')

    expect(body.classes()).toEqual(
      expect.arrayContaining(['mk:bg-surface', 'mk:text-surface-foreground', 'mk:shadow-sm']),
    )
    expect(body.classes()).not.toContain('mk:bg-muted')
    expect(body.classes()).not.toContain('mk:shadow-inner')
  })

  it.each([
    ['default', ['mk:border', 'mk:border-border', 'mk:bg-surface', 'mk:shadow-sm']],
    ['muted', ['mk:border', 'mk:border-border', 'mk:bg-muted']],
    ['outline', ['mk:border', 'mk:border-border', 'mk:bg-transparent']],
  ] as const)('resolves the %s variant', (variant, classes) => {
    const wrapper = mount(MkCard, { props: { variant } })

    expect(wrapper.attributes('data-mk-variant')).toBe(variant)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))
  })

  it.each([
    ['sm', ['mk:gap-3', 'mk:p-4']],
    ['md', ['mk:gap-4', 'mk:p-6']],
    ['lg', ['mk:gap-6', 'mk:p-8']],
  ] as const)('resolves the %s size', (size, classes) => {
    const wrapper = mount(MkCard, { props: { size } })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))
  })

  it('renders header, body, and footer slots in order', () => {
    const wrapper = mount(MkCard, {
      slots: {
        header: '<span>Heading</span>',
        default: '<p>Body</p>',
        footer: '<button>Action</button>',
      },
    })

    const children = (wrapper.element as HTMLElement).children

    expect(children).toHaveLength(3)
    expect(children[0]?.classList).toContain('mk-card__header')
    expect(children[1]?.classList).toContain('mk-card__body')
    expect(children[2]?.classList).toContain('mk-card__footer')
    expect(wrapper.text()).toBe('HeadingBodyAction')
  })

  it('does not render wrappers for omitted slots', () => {
    const wrapper = mount(MkCard, {
      slots: { header: 'Heading' },
    })

    expect(wrapper.find('.mk-card__header').exists()).toBe(true)
    expect(wrapper.find('.mk-card__body').exists()).toBe(false)
    expect(wrapper.find('.mk-card__footer').exists()).toBe(false)
  })

  it('forwards native div attributes', () => {
    const wrapper = mount(MkCard, {
      props: {
        id: 'billing-summary',
        role: 'region',
        'aria-label': 'Billing summary',
      },
    })

    expect(wrapper.attributes('id')).toBe('billing-summary')
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.attributes('aria-label')).toBe('Billing summary')
  })

  it('merges local slot and consumer classes after the recipe', () => {
    const wrapper = mount(MkCard, {
      props: {
        ui: {
          base: 'rounded-none p-10',
          header: 'gap-4',
          body: 'text-sm',
          footer: 'justify-end',
        },
        class: 'account-card p-12',
      },
      slots: {
        header: 'Heading',
        default: 'Body',
        footer: 'Footer',
      },
    })

    expect(wrapper.classes()).toContain('account-card')
    expect(wrapper.classes()).toContain('rounded-none')
    expect(wrapper.classes()).toContain('p-12')
    expect(wrapper.classes()).not.toContain('p-10')
    expect(wrapper.classes()).toContain('mk:rounded-2xl')
    expect(wrapper.classes()).toContain('mk:p-6')
    expect(wrapper.get('.mk-card__header').classes()).toContain('gap-4')
    expect(wrapper.get('.mk-card__body').classes()).toContain('text-sm')
    expect(wrapper.get('.mk-card__footer').classes()).toContain('justify-end')
  })

  it('applies global slot, axis, and default overrides from the Vue plugin', () => {
    const wrapper = mount(MkCard, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              card: {
                base: 'rounded-3xl',
                slots: {
                  header: 'uppercase',
                  footer: 'justify-between',
                },
                variants: {
                  variant: {
                    outline: 'border-2',
                  },
                  size: {
                    lg: 'p-10',
                  },
                  body: {
                    inset: 'border-2',
                  },
                },
                defaultVariants: {
                  variant: 'outline',
                  size: 'lg',
                  body: 'inset',
                },
              },
            },
          }),
        ],
      },
      slots: {
        header: 'Heading',
        default: 'Body',
        footer: 'Footer',
      },
    })

    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-body')).toBe('inset')
    expect(wrapper.classes()).toContain('rounded-3xl')
    expect(wrapper.classes()).toContain('border-2')
    expect(wrapper.classes()).toContain('p-10')
    expect(wrapper.classes()).toContain('mk:rounded-2xl')
    expect(wrapper.classes()).toContain('mk:border')
    expect(wrapper.classes()).toContain('mk:p-8')
    expect(wrapper.get('.mk-card__header').classes()).toContain('uppercase')
    expect(wrapper.get('.mk-card__body').classes()).toContain('border-2')
    expect(wrapper.get('.mk-card__body').classes()).toContain('mk:border')
    expect(wrapper.get('.mk-card__footer').classes()).toContain('justify-between')
  })

  it('exports finite variant, size, and body contracts', () => {
    expect(cardVariants).toEqual(['default', 'muted', 'outline'])
    expect(cardSizes).toEqual(['sm', 'md', 'lg'])
    expect(cardBodies).toEqual(['seamless', 'inset'])
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkCard>[0]['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['id']>().toEqualTypeOf<string | undefined>()
  })
})
