import { mount } from '@vue/test-utils'
import { Primitive } from 'reka-ui'
import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  cardBodyTreatments,
  cardSizes,
  cardVariants,
  createModeKit,
  MkCard,
  MkGrid,
} from '../../../src/index.js'

describe('MkCard', () => {
  it('renders a neutral div container with safe defaults', () => {
    const wrapper = mount(MkCard, {
      slots: { default: 'Card content' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('data-mk-body')).toBe('seamless')
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

  it('renders a one-column MkGrid through the Reka UI Primitive', () => {
    const wrapper = mount(MkCard)

    expect(wrapper.findComponent(MkGrid).exists()).toBe(true)
    expect(wrapper.findComponent(Primitive).exists()).toBe(true)
    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.attributes('data-mk-display')).toBe('grid')
    expect(wrapper.attributes('data-mk-columns')).toBe('1')
    expect(wrapper.classes()).toContain('mk:grid')
    expect(wrapper.classes()).not.toContain('mk:flex')
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
    ['sm', ['mk:rounded-lg', 'mk:p-4'], '0.75rem'],
    ['md', ['mk:rounded-xl', 'mk:p-6'], '1rem'],
    ['lg', ['mk:rounded-2xl', 'mk:p-8'], '1.5rem'],
  ] as const)('resolves the %s size', (size, classes, gap) => {
    const wrapper = mount(MkCard, { props: { size } })
    const style = (wrapper.element as HTMLElement).style

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))
    expect(wrapper.classes()).toContain('mk:shadow-raised')
    expect(style.rowGap).toBe(gap)
    expect(style.columnGap).toBe(gap)
  })

  it.each([
    ['sm', ['mk:-mx-3', 'mk:rounded-md', 'mk:p-4', 'mk:first:-mt-3', 'mk:last:-mb-3']],
    ['md', ['mk:-mx-5', 'mk:rounded-lg', 'mk:p-5', 'mk:first:-mt-5', 'mk:last:-mb-5']],
    ['lg', ['mk:-mx-7', 'mk:rounded-xl', 'mk:p-6', 'mk:first:-mt-7', 'mk:last:-mb-7']],
  ] as const)('renders the inset body treatment at %s size', (size, classes) => {
    const wrapper = mount(MkCard, {
      props: { body: 'inset', size, variant: 'muted' },
      slots: { default: 'Inset content' },
    })
    const body = wrapper.get('.mk-card__body')

    expect(wrapper.attributes('data-mk-body')).toBe('inset')
    expect(body.classes()).toEqual(
      expect.arrayContaining([
        'mk:border',
        'mk:border-solid',
        'mk:border-neutral-200',
        'mk:bg-white',
        'mk:shadow-sm',
        ...classes,
      ]),
    )
  })

  it.each([
    ['sm', ['mk:-mx-4', 'mk:rounded-lg', 'mk:p-4', 'mk:first:-mt-4', 'mk:last:-mb-4']],
    ['md', ['mk:-mx-6', 'mk:rounded-xl', 'mk:p-5', 'mk:first:-mt-6', 'mk:last:-mb-6']],
    ['lg', ['mk:-mx-8', 'mk:rounded-2xl', 'mk:p-6', 'mk:first:-mt-8', 'mk:last:-mb-8']],
  ] as const)('renders the flush body treatment at %s size', (size, classes) => {
    const wrapper = mount(MkCard, {
      props: { body: 'flush', size, variant: 'muted' },
      slots: { default: 'Flush content' },
    })
    const body = wrapper.get('.mk-card__body')

    expect(wrapper.attributes('data-mk-body')).toBe('flush')
    expect(body.classes()).toEqual(
      expect.arrayContaining([
        'mk:border',
        'mk:border-solid',
        'mk:border-neutral-200',
        'mk:bg-white',
        'mk:shadow-sm',
        ...classes,
      ]),
    )
  })

  it.each(['inset', 'flush'] as const)(
    'renders the %s body as a raised panel on a muted surface',
    (bodyTreatment) => {
      const wrapper = mount(MkCard, {
        props: { body: bodyTreatment, variant: 'muted' },
        slots: { default: 'Raised content' },
      })
      const body = wrapper.get('.mk-card__body')

      expect(body.classes()).toContain('mk:bg-white')
      expect(body.classes()).toContain('mk:shadow-sm')
      expect(body.classes()).not.toContain('mk:shadow-inner')
    },
  )

  it.each([
    ['inset', 'shadow'],
    ['inset', 'outline'],
    ['inset', 'plain'],
    ['flush', 'shadow'],
    ['flush', 'outline'],
    ['flush', 'plain'],
  ] as const)(
    'renders the %s body as a recessed well on the %s surface',
    (bodyTreatment, variant) => {
      const wrapper = mount(MkCard, {
        props: { body: bodyTreatment, variant },
        slots: { default: 'Recessed content' },
      })
      const body = wrapper.get('.mk-card__body')

      expect(body.classes()).toContain('mk:bg-neutral-50')
      expect(body.classes()).toContain('mk:shadow-inner')
      expect(body.classes()).not.toContain('mk:shadow-sm')
    },
  )

  it('keeps the seamless body unframed and unpadded', () => {
    const wrapper = mount(MkCard, {
      slots: { default: 'Seamless content' },
    })
    const body = wrapper.get('.mk-card__body')

    expect(body.classes()).not.toContain('mk:border')
    expect(body.classes()).not.toContain('mk:shadow-sm')
    expect(body.classes()).not.toContain('mk:p-5')
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
    expect(title.attributes('data-mk-size')).toBe('md')
    expect(title.classes()).toContain('mk:font-medium')
    expect(title.text()).toBe('Welcome back')
    expect((description.element as HTMLElement).tagName).toBe('P')
    expect(description.attributes('data-mk-size')).toBe('sm')
    expect(description.text()).toBe('Sign in to continue to your account.')
  })

  it('adds header actions without replacing generated title and description content', () => {
    const wrapper = mount(MkCard, {
      props: {
        title: 'Profile',
        description: 'Manage public account details.',
      },
      slots: {
        'header-actions': '<button type="button">Edit</button>',
      },
    })

    const header = wrapper.get('.mk-card__header')
    const content = header.get('.mk-card__header-content')
    const actions = header.get('.mk-card__header-actions')

    expect(content.get('.mk-headline').text()).toBe('Profile')
    expect(content.get('.mk-text').text()).toBe('Manage public account details.')
    expect(actions.get('button').text()).toBe('Edit')
  })

  it('composes header and header-actions slots without replacing either region', () => {
    const wrapper = mount(MkCard, {
      slots: {
        header: '<span class="custom-header">Custom heading</span>',
        'header-actions': '<button type="button">More</button>',
      },
    })

    expect(wrapper.get('.mk-card__header-content .custom-header').text()).toBe('Custom heading')
    expect(wrapper.get('.mk-card__header-actions button').text()).toBe('More')
  })

  it('renders header actions without an empty content wrapper', () => {
    const wrapper = mount(MkCard, {
      slots: {
        'header-actions': '<button type="button">More</button>',
      },
    })

    expect(wrapper.find('.mk-card__header').exists()).toBe(true)
    expect(wrapper.find('.mk-card__header-content').exists()).toBe(false)
    expect(wrapper.get('.mk-card__header-actions').classes()).toContain('mk:ml-auto')
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
          headerContent: 'basis-2/3',
          headerActions: 'self-center',
          body: 'text-sm',
          footer: 'justify-end',
        },
        class: 'account-card p-12',
      },
      slots: {
        header: 'Heading',
        'header-actions': 'Actions',
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
    expect(wrapper.get('.mk-card__header-content').classes()).toContain('basis-2/3')
    expect(wrapper.get('.mk-card__header-actions').classes()).toContain('self-center')
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
                  headerActions: 'items-end',
                  body: 'border-2',
                  footer: 'justify-between',
                },
                variants: {
                  body: {
                    inset: 'ring-2',
                  },
                  variant: {
                    outline: 'border-2',
                  },
                  size: {
                    lg: 'p-10',
                  },
                },
                defaultVariants: {
                  body: 'inset',
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
        'header-actions': 'Actions',
        default: 'Body',
        footer: 'Footer',
      },
    })

    expect(wrapper.attributes('data-mk-body')).toBe('inset')
    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.classes()).toContain('rounded-3xl')
    expect(wrapper.classes()).not.toContain('ring-2')
    expect(wrapper.classes()).toContain('border-2')
    expect(wrapper.classes()).toContain('p-10')
    expect(wrapper.classes()).toContain('mk:rounded-2xl')
    expect(wrapper.classes()).toContain('mk:border')
    expect(wrapper.classes()).toContain('mk:p-8')
    expect(wrapper.get('.mk-card__header').classes()).toContain('uppercase')
    expect(wrapper.get('.mk-card__header-actions').classes()).toContain('items-end')
    expect(wrapper.get('.mk-card__body').classes()).toContain('ring-2')
    expect(wrapper.get('.mk-card__body').classes()).toContain('border-2')
    expect(wrapper.get('.mk-card__footer').classes()).toContain('justify-between')
  })

  it('exports finite body treatment, variant, and size contracts', () => {
    expect(cardBodyTreatments).toEqual(['seamless', 'inset', 'flush'])
    expect(cardVariants).toEqual(['shadow', 'muted', 'outline', 'plain'])
    expect(cardSizes).toEqual(['sm', 'md', 'lg'])
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkCard>[0]['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['body']>().toEqualTypeOf<
      'seamless' | 'inset' | 'flush' | undefined
    >()
    expectTypeOf<Parameters<typeof MkCard>[0]['id']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['title']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkCard>[0]['description']>().toEqualTypeOf<string | undefined>()
  })
})
