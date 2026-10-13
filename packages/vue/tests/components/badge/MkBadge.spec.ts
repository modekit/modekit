import { mount } from '@vue/test-utils'
import { Primitive } from 'reka-ui'
import { describe, expect, it } from 'vitest'

import { badgeColors, badgeVariants, createModeKit, MkBadge } from '../../../src/index.js'

const colorClasses = {
  solid: 'mk:bg-component',
  foreground: 'mk:text-component-foreground',
  text: 'mk:text-component',
  outline: 'mk:border-component',
  soft: 'mk:bg-component-soft',
}

const combinations = badgeColors.flatMap((color) =>
  badgeVariants.map((variant) => ({ color, variant })),
)

describe('MkBadge', () => {
  it('renders a compact native span with safe defaults', () => {
    const wrapper = mount(MkBadge, {
      slots: { default: 'New' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('SPAN')
    expect(wrapper.findComponent(Primitive).exists()).toBe(true)
    expect(wrapper.attributes('data-mk-color')).toBe('primary')
    expect(wrapper.attributes('data-mk-variant')).toBe('default')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-rounded')).toBeUndefined()
    expect(wrapper.classes()).toContain('mk:bg-component')
    expect(wrapper.classes()).toContain('mk:text-component-foreground')
    expect(wrapper.classes()).toContain('mk:py-1')
    expect(wrapper.classes()).toContain('mk:text-sm')
    expect(wrapper.classes()).toContain('mk:rounded-md')
    expect(wrapper.text()).toBe('New')
  })

  it('renders through the configured root element', () => {
    const wrapper = mount(MkBadge, {
      props: { as: 'a' },
      attrs: { href: '#release-status' },
      slots: { default: 'Release status' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('#release-status')
    expect(wrapper.text()).toBe('Release status')
  })

  it.each(combinations)(
    'resolves the $color/$variant classes from the Badge style recipe',
    ({ color, variant }) => {
      const wrapper = mount(MkBadge, {
        props: { color, variant },
      })
      const expected = colorClasses

      expect(wrapper.attributes('data-mk-color')).toBe(color)
      expect(wrapper.attributes('data-mk-variant')).toBe(variant)

      if (variant === 'default') {
        expect(wrapper.classes()).toContain(expected.solid)
        expect(wrapper.classes()).toContain(expected.foreground)
      } else {
        expect(wrapper.classes()).toContain(expected.text)
      }

      if (variant === 'soft' || variant === 'subtle') {
        expect(wrapper.classes()).toContain(expected.soft)
      }

      if (variant === 'outline' || variant === 'subtle') {
        expect(wrapper.classes()).toContain('mk:border')
        expect(wrapper.classes()).toContain('mk:border-solid')
        expect(wrapper.classes()).toContain(expected.outline)
      } else {
        expect(wrapper.classes()).toContain('mk:border-0')
      }
    },
  )

  it.each([
    ['sm', 'mk:py-1', 'mk:gap-0.5', 'mk:text-xs', 'mk:[&>svg]:size-3.5'],
    ['md', 'mk:py-1', 'mk:gap-1', 'mk:text-sm', 'mk:[&>svg]:size-4'],
    ['lg', 'mk:py-1.5', 'mk:gap-1', 'mk:text-sm', 'mk:[&>svg]:size-4.5'],
  ] as const)('resolves the user-defined %s size', (size, padding, gap, text, icon) => {
    const wrapper = mount(MkBadge, {
      props: { size },
      slots: { default: 'Status' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toContain(padding)
    expect(wrapper.classes()).toContain(gap)
    expect(wrapper.classes()).toContain(text)
    expect(wrapper.classes()).toContain(icon)
  })

  it('uses fully rounded corners when rounded is enabled', () => {
    const wrapper = mount(MkBadge, {
      props: { rounded: true },
      slots: { default: 'Pill' },
    })

    expect(wrapper.attributes('data-mk-rounded')).toBe('')
    expect(wrapper.classes()).toContain('mk:rounded-full')
    expect(wrapper.classes()).not.toContain('mk:rounded-md')
  })

  it('renders leading, default, and trailing slots in order', () => {
    const wrapper = mount(MkBadge, {
      slots: {
        leading: '<svg data-slot="leading" />',
        default: '<span>Status</span>',
        trailing: '<svg data-slot="trailing" />',
      },
    })

    const children = (wrapper.element as HTMLElement).children

    expect(children).toHaveLength(3)
    expect(children[0]?.getAttribute('data-slot')).toBe('leading')
    expect(children[1]?.textContent).toBe('Status')
    expect(children[2]?.getAttribute('data-slot')).toBe('trailing')
  })

  it('forwards native span attributes', () => {
    const wrapper = mount(MkBadge, {
      props: {
        id: 'release-status',
        role: 'status',
        'aria-label': 'Release status: ready',
        title: 'Ready for release',
      },
    })

    expect(wrapper.attributes('id')).toBe('release-status')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Release status: ready')
    expect(wrapper.attributes('title')).toBe('Ready for release')
  })

  it('merges local and native classes after the recipe', () => {
    const wrapper = mount(MkBadge, {
      props: {
        rounded: true,
        ui: { base: 'rounded-none px-4' },
        class: 'release-badge rounded-full px-5',
      },
    })

    expect(wrapper.classes()).toContain('release-badge')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('px-5')
    expect(wrapper.classes()).not.toContain('rounded-none')
    expect(wrapper.classes()).not.toContain('px-4')
    expect(wrapper.classes()).toContain('mk:rounded-full')
    expect(wrapper.classes()).toContain('mk:px-2')
  })

  it('applies global axes, compound overrides, and defaults from the Vue plugin', () => {
    const wrapper = mount(MkBadge, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              badge: {
                base: 'font-bold',
                variants: {
                  color: {
                    success: 'tracking-wide',
                  },
                  variant: {
                    outline: 'border-2',
                  },
                  size: {
                    md: 'h-8',
                  },
                  rounded: {
                    true: 'shadow-sm',
                  },
                },
                compoundVariants: [
                  {
                    color: ['success', 'info'],
                    variant: ['outline', 'subtle'],
                    rounded: true,
                    class: 'uppercase ring-1',
                  },
                ],
                defaultVariants: {
                  color: 'success',
                  variant: 'outline',
                  size: 'md',
                  rounded: true,
                },
              },
            },
          }),
        ],
      },
      slots: { default: 'Ready' },
    })

    expect(wrapper.attributes('data-mk-color')).toBe('success')
    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-rounded')).toBe('')
    expect(wrapper.classes()).toContain('font-bold')
    expect(wrapper.classes()).toContain('tracking-wide')
    expect(wrapper.classes()).toContain('border-2')
    expect(wrapper.classes()).toContain('h-8')
    expect(wrapper.classes()).toContain('shadow-sm')
    expect(wrapper.classes()).toContain('uppercase')
    expect(wrapper.classes()).toContain('ring-1')
    expect(wrapper.classes()).toContain('mk:border-component')
    expect(wrapper.classes()).toContain('mk:text-component')
    expect(wrapper.classes()).toContain('mk:py-1')
    expect(wrapper.classes()).toContain('mk:rounded-full')
  })
})
