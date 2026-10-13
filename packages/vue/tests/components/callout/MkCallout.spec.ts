import { mount } from '@vue/test-utils'
import { Primitive } from 'reka-ui'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import { calloutColors, calloutVariants, createModeKit, MkCallout } from '../../../src/index.js'

const colorClasses = {
  solid: 'mk:bg-component',
  foreground: 'mk:text-component-foreground',
  text: 'mk:text-component',
  outline: 'mk:border-component',
  soft: 'mk:bg-component-soft',
}

const combinations = calloutColors.flatMap((color) =>
  calloutVariants.map((variant) => ({ color, variant })),
)

describe('MkCallout', () => {
  it('renders a neutral div with safe visual and semantic defaults', () => {
    const wrapper = mount(MkCallout, {
      props: { title: 'Update available' },
      slots: { default: 'Install the latest version when convenient.' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('DIV')
    expect(wrapper.findComponent(Primitive).exists()).toBe(true)
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('data-mk-color')).toBe('sky')
    expect(wrapper.attributes('data-mk-variant')).toBe('soft')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-dismissible')).toBeUndefined()
    expect(wrapper.classes()).toContain('mk:bg-component-soft')
    expect(wrapper.classes()).toContain('mk:text-component')
    expect(wrapper.classes()).toContain('mk:p-4')
    expect(wrapper.find('.mk-callout__title').text()).toBe('Update available')
    expect(wrapper.find('.mk-callout__description').text()).toBe(
      'Install the latest version when convenient.',
    )
  })

  it('renders through a configured root and forwards native attributes', () => {
    const wrapper = mount(MkCallout, {
      props: { as: 'section' },
      attrs: {
        id: 'service-notice',
        role: 'status',
        'aria-label': 'Service notice',
        'data-context': 'system-health',
      },
      slots: { default: 'Everything is operating normally.' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('SECTION')
    expect(wrapper.attributes('id')).toBe('service-notice')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Service notice')
    expect(wrapper.attributes('data-context')).toBe('system-health')
  })

  it.each(combinations)(
    'resolves the $color/$variant classes from the Callout style recipe',
    ({ color, variant }) => {
      const wrapper = mount(MkCallout, { props: { color, variant } })
      const expected = colorClasses

      expect(wrapper.attributes('data-mk-color')).toBe(color)
      expect(wrapper.attributes('data-mk-variant')).toBe(variant)

      if (variant === 'solid') {
        expect(wrapper.classes()).toContain(expected.solid)
        expect(wrapper.classes()).toContain(expected.foreground)
      } else {
        expect(wrapper.classes()).toContain(expected.text)
      }

      if (variant === 'soft') {
        expect(wrapper.classes()).toContain(expected.soft)
      }

      if (variant === 'outline') {
        expect(wrapper.classes()).toContain('mk:border')
        expect(wrapper.classes()).toContain('mk:border-solid')
        expect(wrapper.classes()).toContain('mk:bg-white')
        expect(wrapper.classes()).toContain(expected.outline)
      } else {
        expect(wrapper.classes()).toContain('mk:border-0')
      }
    },
  )

  it.each([
    {
      size: 'sm',
      root: ['mk:gap-2.5', 'mk:rounded-lg', 'mk:p-3'],
      icon: 'mk:size-4',
      title: 'mk:text-sm',
      description: 'mk:text-xs',
      actions: 'mk:mt-2',
      close: 'mk:size-6',
    },
    {
      size: 'md',
      root: ['mk:gap-3', 'mk:rounded-xl', 'mk:p-4'],
      icon: 'mk:size-5',
      title: 'mk:text-sm',
      description: 'mk:text-sm',
      actions: 'mk:mt-3',
      close: 'mk:size-7',
    },
    {
      size: 'lg',
      root: ['mk:gap-3.5', 'mk:rounded-xl', 'mk:p-5'],
      icon: 'mk:size-6',
      title: 'mk:text-base',
      description: 'mk:text-sm',
      actions: 'mk:mt-4',
      close: 'mk:size-8',
    },
  ] as const)('resolves the $size root and slot geometry', (expectation) => {
    const wrapper = mount(MkCallout, {
      props: { size: expectation.size, title: 'Scheduled maintenance', dismissible: true },
      slots: {
        icon: '<svg />',
        default: 'The service will be unavailable briefly.',
        actions: '<button>View schedule</button>',
      },
    })

    expect(wrapper.attributes('data-mk-size')).toBe(expectation.size)
    for (const className of expectation.root) expect(wrapper.classes()).toContain(className)
    expect(wrapper.find('.mk-callout__icon').classes()).toContain(expectation.icon)
    expect(wrapper.find('.mk-callout__title').classes()).toContain(expectation.title)
    expect(wrapper.find('.mk-callout__description').classes()).toContain(expectation.description)
    expect(wrapper.find('.mk-callout__actions').classes()).toContain(expectation.actions)
    expect(wrapper.find('.mk-callout__close').classes()).toContain(expectation.close)
  })

  it('renders icon, title, description, actions, and close content in order', () => {
    const wrapper = mount(MkCallout, {
      props: { title: 'Payment received', dismissible: true },
      slots: {
        icon: '<svg data-slot="icon" />',
        title: ({ title }) => h('strong', { 'data-slot': 'title' }, title),
        default: '<p data-slot="description">Your balance is up to date.</p>',
        actions: '<button data-slot="actions">View receipt</button>',
        close: ({ label }) => h('span', { 'data-slot': 'close' }, label),
      },
    })

    const children = (wrapper.element as HTMLElement).children

    expect(children).toHaveLength(3)
    expect(children[0]?.classList).toContain('mk-callout__icon')
    expect(children[1]?.classList).toContain('mk-callout__content')
    expect(children[2]?.classList).toContain('mk-callout__close')
    expect(wrapper.find('.mk-callout__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('[data-slot="title"]').text()).toBe('Payment received')
    expect(wrapper.find('[data-slot="description"]').text()).toBe('Your balance is up to date.')
    expect(wrapper.find('[data-slot="actions"]').text()).toBe('View receipt')
    expect(wrapper.find('[data-slot="close"]').text()).toBe('Dismiss callout')
  })

  it('emits close without removing consumer-owned content', async () => {
    const wrapper = mount(MkCallout, {
      props: {
        dismissible: true,
        dismissLabel: 'Dismiss maintenance notice',
      },
      slots: { default: 'Maintenance begins at 22:00.' },
    })
    const close = wrapper.get('button')

    expect(wrapper.attributes('data-mk-dismissible')).toBe('')
    expect(close.attributes('type')).toBe('button')
    expect(close.attributes('aria-label')).toBe('Dismiss maintenance notice')
    expect(close.find('svg').attributes('aria-hidden')).toBe('true')

    await close.trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('close')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(wrapper.text()).toContain('Maintenance begins at 22:00.')
  })

  it('omits wrappers for slots that are not present', () => {
    const wrapper = mount(MkCallout)

    expect(wrapper.find('.mk-callout__icon').exists()).toBe(false)
    expect(wrapper.find('.mk-callout__content').exists()).toBe(false)
    expect(wrapper.find('.mk-callout__close').exists()).toBe(false)
  })

  it('merges local slot and native root overrides after built-in styles', () => {
    const wrapper = mount(MkCallout, {
      props: {
        title: 'Custom callout',
        dismissible: true,
        ui: {
          base: 'rounded-none p-8',
          icon: 'icon-custom',
          content: 'content-custom',
          title: 'title-custom',
          description: 'description-custom',
          actions: 'actions-custom',
          close: 'close-custom',
        },
        class: 'callout-custom rounded-full p-10',
      },
      slots: {
        icon: '<svg />',
        default: 'Customized content.',
        actions: '<button>Action</button>',
      },
    })

    expect(wrapper.classes()).toContain('callout-custom')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('p-10')
    expect(wrapper.classes()).not.toContain('rounded-none')
    expect(wrapper.classes()).not.toContain('p-8')
    expect(wrapper.classes()).toContain('mk:rounded-xl')
    expect(wrapper.classes()).toContain('mk:p-4')
    expect(wrapper.find('.mk-callout__icon').classes()).toContain('icon-custom')
    expect(wrapper.find('.mk-callout__content').classes()).toContain('content-custom')
    expect(wrapper.find('.mk-callout__title').classes()).toContain('title-custom')
    expect(wrapper.find('.mk-callout__description').classes()).toContain('description-custom')
    expect(wrapper.find('.mk-callout__actions').classes()).toContain('actions-custom')
    expect(wrapper.find('.mk-callout__close').classes()).toContain('close-custom')
  })

  it('applies global axes, slots, compound overrides, and defaults', () => {
    const wrapper = mount(MkCallout, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              callout: {
                base: 'font-bold',
                slots: {
                  icon: 'icon-global',
                  content: 'content-global',
                  title: 'title-global',
                  description: 'description-global',
                  actions: 'actions-global',
                  close: 'close-global',
                },
                variants: {
                  color: {
                    red: 'tracking-wide',
                  },
                  variant: {
                    outline: 'border-2',
                  },
                  size: {
                    lg: 'min-h-20',
                  },
                },
                compoundVariants: [
                  {
                    color: ['red', 'amber'],
                    variant: ['outline', 'soft'],
                    size: 'lg',
                    class: 'uppercase ring-1',
                  },
                ],
                defaultVariants: {
                  color: 'red',
                  variant: 'outline',
                  size: 'lg',
                },
              },
            },
          }),
        ],
      },
      props: { title: 'Connection lost', dismissible: true },
      slots: {
        icon: '<svg />',
        default: 'Check your network and try again.',
        actions: '<button>Retry</button>',
      },
    })

    expect(wrapper.attributes('data-mk-color')).toBe('red')
    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.classes()).toContain('font-bold')
    expect(wrapper.classes()).toContain('tracking-wide')
    expect(wrapper.classes()).toContain('border-2')
    expect(wrapper.classes()).toContain('min-h-20')
    expect(wrapper.classes()).toContain('uppercase')
    expect(wrapper.classes()).toContain('ring-1')
    expect(wrapper.classes()).toContain('mk:border-component')
    expect(wrapper.classes()).toContain('mk:text-component')
    expect(wrapper.classes()).toContain('mk:p-5')
    expect(wrapper.find('.mk-callout__icon').classes()).toContain('icon-global')
    expect(wrapper.find('.mk-callout__content').classes()).toContain('content-global')
    expect(wrapper.find('.mk-callout__title').classes()).toContain('title-global')
    expect(wrapper.find('.mk-callout__description').classes()).toContain('description-global')
    expect(wrapper.find('.mk-callout__actions').classes()).toContain('actions-global')
    expect(wrapper.find('.mk-callout__close').classes()).toContain('close-global')
  })
})
