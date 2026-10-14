import { mount } from '@vue/test-utils'
import { Primitive } from 'reka-ui'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { cardSizes, cardVariants, createModeKit, MkCard } from '../../../src/index.js'

describe('MkCard', () => {
  it('renders a neutral div container with safe defaults', () => {
    const wrapper = mount(MkCard, {
      slots: { default: 'Card content' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('data-mk-variant')).toBe('shadow')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.classes()).toContain('mk:rounded-xl')
    expect(wrapper.classes()).not.toContain('mk:border')
    expect(wrapper.classes()).not.toContain('mk:border-solid')
    expect(wrapper.classes()).not.toContain('mk:border-neutral-200')
    expect(wrapper.classes()).toContain('mk:bg-white')
    expect(wrapper.classes()).toContain('mk:text-neutral-950')
    expect(wrapper.classes()).toContain('mk:shadow-raised')
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
    ['shadow', ['mk:bg-white', 'mk:shadow-raised'], false],
    ['muted', ['mk:bg-neutral-100'], false],
    ['outline', ['mk:border', 'mk:border-solid', 'mk:border-neutral-200', 'mk:bg-white'], true],
    ['plain', ['mk:bg-white'], false],
  ] as const)('resolves the %s variant', (variant, classes, hasBorder) => {
    const wrapper = mount(MkCard, { props: { variant } })

    expect(wrapper.attributes('data-mk-variant')).toBe(variant)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))
    expect(wrapper.classes().includes('mk:border')).toBe(hasBorder)
    expect(wrapper.classes().includes('mk:border-solid')).toBe(hasBorder)
    expect(wrapper.classes().includes('mk:border-neutral-200')).toBe(hasBorder)
  })

  it.each([
    ['sm', ['mk:gap-3', 'mk:rounded-lg', 'mk:p-4']],
    ['md', ['mk:gap-4', 'mk:rounded-xl', 'mk:p-6']],
    ['lg', ['mk:gap-6', 'mk:rounded-2xl', 'mk:p-8']],
  ] as const)('resolves the %s size', (size, classes) => {
    const wrapper = mount(MkCard, { props: { size } })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))
    expect(wrapper.classes()).toContain('mk:shadow-raised')
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

  it('renders title and description props through typography components', () => {
    const wrapper = mount(MkCard, {
      props: {
        title: 'Welcome back',
        description: 'Sign in to continue to your account.',
      },
    })

    const header = wrapper.get('.mk-card__header')
    const title = header.get('.mk-headline')
    const description = header.get('.mk-text')

    expect((title.element as HTMLElement).tagName).toBe('H3')
    expect(title.attributes('data-mk-size')).toBe('xs')
    expect(title.text()).toBe('Welcome back')
    expect((description.element as HTMLElement).tagName).toBe('P')
    expect(description.attributes('data-mk-size')).toBe('sm')
    expect(description.text()).toBe('Sign in to continue to your account.')
  })

  it('renders a header when only the title prop is supplied', () => {
    const wrapper = mount(MkCard, { props: { title: 'Title only' } })

    expect(wrapper.get('.mk-card__header').text()).toBe('Title only')
    expect(wrapper.get('.mk-headline').text()).toBe('Title only')
    expect(wrapper.find('.mk-text').exists()).toBe(false)
  })

  it('renders a header when only the description prop is supplied', () => {
    const wrapper = mount(MkCard, { props: { description: 'Description only' } })

    expect(wrapper.get('.mk-card__header').text()).toBe('Description only')
    expect(wrapper.get('.mk-text').text()).toBe('Description only')
    expect(wrapper.find('.mk-headline').exists()).toBe(false)
  })

  it('gives the header slot precedence over title and description props', () => {
    const wrapper = mount(MkCard, {
      props: {
        title: 'Generated title',
        description: 'Generated description',
      },
      slots: {
        header: '<span class="custom-header">Custom header</span>',
      },
    })

    const header = wrapper.get('.mk-card__header')
    expect(header.get('.custom-header').text()).toBe('Custom header')
    expect(header.find('.mk-headline').exists()).toBe(false)
    expect(header.find('.mk-text').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Generated title')
    expect(wrapper.text()).not.toContain('Generated description')
  })

  it('does not render wrappers for omitted slots and header props', () => {
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
    expect(wrapper.classes()).toContain('mk:rounded-xl')
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
                  body: 'border-2',
                  footer: 'justify-between',
                },
                variants: {
                  variant: {
                    outline: 'border-2',
                  },
                  size: {
                    lg: 'p-10',
                  },
                },
                defaultVariants: {
                  variant: 'outline',
                  size: 'lg',
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
    expect(wrapper.classes()).toContain('rounded-3xl')
    expect(wrapper.classes()).toContain('border-2')
    expect(wrapper.classes()).toContain('p-10')
    expect(wrapper.classes()).toContain('mk:rounded-2xl')
    expect(wrapper.classes()).toContain('mk:border')
    expect(wrapper.classes()).toContain('mk:p-8')
    expect(wrapper.get('.mk-card__header').classes()).toContain('uppercase')
    expect(wrapper.get('.mk-card__body').classes()).toContain('border-2')
    expect(wrapper.get('.mk-card__footer').classes()).toContain('justify-between')
  })

  it('exports finite variant and size contracts', () => {
    expect(cardVariants).toEqual(['shadow', 'muted', 'outline', 'plain'])
    expect(cardSizes).toEqual(['sm', 'md', 'lg'])
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkCard>[0]['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['title']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['description']>().toEqualTypeOf<string | undefined>()
  })
})
