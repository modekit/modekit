import { mount } from '@vue/test-utils'
import { Separator as RekaSeparator } from 'reka-ui'
import { describe, expect, it } from 'vitest'

import {
  createModeKit,
  MkSeparator,
  MkText,
  separatorSizes,
  separatorTypes,
} from '../../../src/index.js'

const sizeClasses = {
  sm: {
    root: 'mk:gap-2',
    horizontal: 'mk:border-t',
    vertical: 'mk:border-l',
    label: 'mk:text-xs',
    icon: 'mk:size-3.5',
  },
  md: {
    root: 'mk:gap-3',
    horizontal: 'mk:border-t-2',
    vertical: 'mk:border-l-2',
    label: 'mk:text-sm',
    icon: 'mk:size-4',
  },
  lg: {
    root: 'mk:gap-4',
    horizontal: 'mk:border-t-4',
    vertical: 'mk:border-l-4',
    label: 'mk:text-base',
    icon: 'mk:size-5',
  },
} as const

const typeClasses = {
  solid: 'mk:border-solid',
  dashed: 'mk:border-dashed',
  dotted: 'mk:border-dotted',
} as const

describe('MkSeparator', () => {
  it('renders a semantic horizontal separator with safe defaults', () => {
    const wrapper = mount(MkSeparator)
    const lines = wrapper.findAll('.mk-separator__line')

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.findComponent(RekaSeparator).exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBeUndefined()
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    expect(wrapper.attributes('data-mk-orientation')).toBe('horizontal')
    expect(wrapper.attributes('data-mk-position')).toBe('center')
    expect(wrapper.attributes('data-mk-size')).toBe('sm')
    expect(wrapper.attributes('data-mk-type')).toBe('solid')
    expect(wrapper.attributes('data-mk-primary')).toBeUndefined()
    expect(wrapper.classes()).toContain('mk:w-full')
    expect(wrapper.classes()).toContain('mk:gap-2')
    expect(lines).toHaveLength(1)
    expect(lines[0]?.classes()).toContain('mk:border-t')
    expect(lines[0]?.classes()).toContain('mk:border-solid')
    expect(lines[0]?.classes()).toContain('mk:border-neutral-200')
  })

  it('renders through the configured root and forwards native attributes', () => {
    const wrapper = mount(MkSeparator, {
      props: {
        as: 'section',
        id: 'account-boundary',
        title: 'Account boundary',
        'aria-label': 'Custom account boundary',
      },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('SECTION')
    expect(wrapper.attributes('id')).toBe('account-boundary')
    expect(wrapper.attributes('title')).toBe('Account boundary')
    expect(wrapper.attributes('aria-label')).toBe('Custom account boundary')
  })

  it('renders a centered label between two line segments', () => {
    const wrapper = mount(MkSeparator, {
      props: { label: 'Continue' },
    })

    expect(wrapper.attributes('aria-label')).toBe('Continue')
    expect(wrapper.findAll('.mk-separator__line')).toHaveLength(2)
    expect(wrapper.find('.mk-separator__content').exists()).toBe(true)
    expect(wrapper.find('.mk-separator__label').text()).toBe('Continue')
    expect(wrapper.findComponent(MkText).exists()).toBe(true)
    expect(wrapper.findComponent(MkText).attributes('data-mk-size')).toBe('xs')
    expect(wrapper.findComponent(MkText).attributes('data-mk-variant')).toBe('label')
    expect(wrapper.findComponent(MkText).classes()).toContain('mk:font-medium')
    expect(wrapper.find('.mk-separator__icon').exists()).toBe(false)
  })

  it('renders the icon slot before the optional label', () => {
    const wrapper = mount(MkSeparator, {
      props: { label: 'Featured' },
      slots: { icon: '<svg data-icon="star" />' },
    })
    const content = wrapper.find('.mk-separator__content')

    expect(content.find('.mk-separator__icon svg').attributes('data-icon')).toBe('star')
    expect(content.find('.mk-separator__icon').attributes('aria-hidden')).toBe('true')
    expect(Array.from(content.element.children).map((child) => child.className)).toEqual([
      expect.stringContaining('mk-separator__icon'),
      expect.stringContaining('mk-separator__label'),
    ])
  })

  it.each([
    ['start', 'content-first'],
    ['center', 'line-first'],
    ['end', 'line-first'],
  ] as const)('positions labeled content at %s', (position, firstChild) => {
    const wrapper = mount(MkSeparator, {
      props: { label: 'Section', position },
    })
    const children = Array.from((wrapper.element as HTMLElement).children)
    const lineCount = children.filter((child) =>
      child.classList.contains('mk-separator__line'),
    ).length

    expect(wrapper.attributes('data-mk-position')).toBe(position)
    expect(lineCount).toBe(position === 'center' ? 2 : 1)
    expect(children[0]?.classList.contains('mk-separator__content')).toBe(
      firstChild === 'content-first',
    )
    expect(children.at(-1)?.classList.contains('mk-separator__content')).toBe(position === 'end')
  })

  it.each(['horizontal', 'vertical'] as const)(
    'applies %s orientation semantics and geometry',
    (orientation) => {
      const wrapper = mount(MkSeparator, {
        props: { label: 'Boundary', orientation },
      })
      const line = wrapper.find('.mk-separator__line')

      expect(wrapper.attributes('data-orientation')).toBe(orientation)
      expect(wrapper.attributes('data-mk-orientation')).toBe(orientation)
      expect(wrapper.attributes('aria-orientation')).toBe(
        orientation === 'vertical' ? 'vertical' : undefined,
      )
      expect(wrapper.classes()).toContain(orientation === 'vertical' ? 'mk:flex-col' : 'mk:w-full')
      if (orientation === 'vertical') {
        expect(wrapper.classes()).toContain('mk:self-stretch')
        expect(wrapper.classes()).not.toContain('mk:h-full')
      }
      expect(line.classes()).toContain(orientation === 'vertical' ? 'mk:border-l' : 'mk:border-t')
    },
  )

  it.each(separatorSizes.flatMap((size) => separatorTypes.map((type) => ({ size, type }))))(
    'resolves the $size/$type style combination',
    ({ size, type }) => {
      const wrapper = mount(MkSeparator, {
        props: { label: 'Section', size, type },
        slots: { icon: '<svg />' },
      })
      const line = wrapper.find('.mk-separator__line')

      expect(wrapper.classes()).toContain(sizeClasses[size].root)
      expect(line.classes()).toContain(sizeClasses[size].horizontal)
      expect(line.classes()).toContain(typeClasses[type])
      expect(wrapper.findComponent(MkText).classes()).toContain(sizeClasses[size].label)
      expect(wrapper.find('.mk-separator__icon').classes()).toContain(sizeClasses[size].icon)
    },
  )

  it('uses the primary color for line and content when enabled', () => {
    const wrapper = mount(MkSeparator, {
      props: { label: 'Primary section', primary: true },
    })

    expect(wrapper.attributes('data-mk-primary')).toBe('')
    expect(wrapper.find('.mk-separator__line').classes()).toContain('mk:border-primary')
    expect(wrapper.find('.mk-separator__content').classes()).toContain('mk:text-primary')
  })

  it('merges local slot UI and native root classes after the recipe', () => {
    const wrapper = mount(MkSeparator, {
      props: {
        label: 'Custom',
        ui: {
          base: 'mk:gap-6 local-root',
          line: 'local-line',
          content: 'local-content',
          label: 'local-label',
        },
        class: 'mk:gap-8 native-root',
      },
    })

    expect(wrapper.classes()).toContain('native-root')
    expect(wrapper.classes()).toContain('mk:gap-8')
    expect(wrapper.classes()).not.toContain('mk:gap-2')
    expect(wrapper.classes()).not.toContain('mk:gap-6')
    expect(wrapper.find('.mk-separator__line').classes()).toContain('local-line')
    expect(wrapper.find('.mk-separator__content').classes()).toContain('local-content')
    expect(wrapper.find('.mk-separator__label').classes()).toContain('local-label')
  })

  it('applies global axes, slots, compounds, and defaults from the Vue plugin', () => {
    const wrapper = mount(MkSeparator, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              separator: {
                base: 'global-root',
                slots: {
                  line: 'global-line',
                  content: 'global-content',
                  label: 'global-label',
                },
                variants: {
                  primary: { true: 'global-primary' },
                  size: { lg: 'global-large' },
                  type: { dashed: 'global-dashed' },
                  orientation: { vertical: 'global-vertical' },
                  position: { end: 'global-end' },
                },
                compoundVariants: [
                  {
                    primary: true,
                    size: ['md', 'lg'],
                    type: ['dashed', 'dotted'],
                    orientation: 'vertical',
                    position: 'end',
                    class: 'global-compound',
                  },
                ],
                defaultVariants: {
                  primary: true,
                  size: 'lg',
                  type: 'dashed',
                  orientation: 'vertical',
                  position: 'end',
                },
              },
            },
          }),
        ],
      },
      props: { label: 'Configured' },
    })

    expect(wrapper.attributes('data-mk-primary')).toBe('')
    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-type')).toBe('dashed')
    expect(wrapper.attributes('data-mk-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-mk-position')).toBe('end')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'global-root',
        'global-primary',
        'global-large',
        'global-dashed',
        'global-vertical',
        'global-end',
        'global-compound',
      ]),
    )
    expect(wrapper.find('.mk-separator__line').classes()).toContain('global-line')
    expect(wrapper.find('.mk-separator__content').classes()).toContain('global-content')
    expect(wrapper.find('.mk-separator__label').classes()).toContain('global-label')
  })
})
