import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { buttonColors, buttonVariants, createModeKit, MkButton } from '../../../src/index.js'
import type { ButtonColor } from '../../../src/index.js'

interface ColorClassExpectations {
  focus: string
  solid: string
  foreground: string
  text: string
  outline: string
  soft: string
  ghost: string
}

const colorClasses: Record<ButtonColor, ColorClassExpectations> = {
  primary: {
    focus: 'focus-visible:outline-primary',
    solid: 'bg-primary',
    foreground: 'text-primary-foreground',
    text: 'text-primary',
    outline: 'border-primary',
    soft: 'bg-primary/15',
    ghost: 'hover:bg-primary/10',
  },
  destructive: {
    focus: 'focus-visible:outline-destructive',
    solid: 'bg-destructive',
    foreground: 'text-destructive-foreground',
    text: 'text-destructive',
    outline: 'border-destructive',
    soft: 'bg-destructive/15',
    ghost: 'hover:bg-destructive/10',
  },
}

const combinations = buttonColors.flatMap((color) =>
  buttonVariants.map((variant) => ({ color, variant })),
)

describe('MkButton', () => {
  it('renders a native button with safe defaults', () => {
    const wrapper = mount(MkButton, {
      slots: { default: 'Save' },
    })

    expect((wrapper.element as HTMLElement).tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('data-mk-color')).toBe('primary')
    expect(wrapper.attributes('data-mk-variant')).toBe('default')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.classes()).toContain('focus-visible:outline-primary')
    expect(wrapper.classes()).toContain('bg-primary')
    expect(wrapper.classes()).toContain('text-primary-foreground')
    expect(wrapper.classes()).toContain('h-10')
    expect(wrapper.text()).toBe('Save')
  })

  it('defines border and focus styles without relying on application resets', () => {
    const wrapper = mount(MkButton, {
      props: { variant: 'outline' },
    })

    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('border-solid')
    expect(wrapper.classes()).toContain('focus-visible:outline-2')
    expect(wrapper.classes()).toContain('focus-visible:outline-solid')
    expect(wrapper.classes()).toContain('focus-visible:outline-primary')
  })

  it.each(combinations)(
    'resolves the $color/$variant classes from the Button style recipe',
    ({ color, variant }) => {
      const wrapper = mount(MkButton, {
        props: { color, variant },
      })

      const expected = colorClasses[color]

      expect(wrapper.attributes('data-mk-color')).toBe(color)
      expect(wrapper.attributes('data-mk-variant')).toBe(variant)
      expect(wrapper.classes()).toContain(expected.focus)

      if (variant === 'default') {
        expect(wrapper.classes()).toContain(expected.solid)
        expect(wrapper.classes()).toContain(expected.foreground)
      } else {
        expect(wrapper.classes()).toContain(expected.text)
      }

      if (variant === 'outline') {
        expect(wrapper.classes()).toContain('border')
        expect(wrapper.classes()).toContain(expected.outline)
      }

      if (variant === 'soft' || variant === 'subtle') {
        expect(wrapper.classes()).toContain(expected.soft)
      }

      if (variant === 'subtle') {
        expect(wrapper.classes()).toContain('border')
        expect(wrapper.classes()).toContain(expected.outline)
      }

      if (variant === 'ghost') {
        expect(wrapper.classes()).toContain(expected.ghost)
      }

      if (variant === 'link') {
        expect(wrapper.classes()).toContain('hover:underline')
      }
    },
  )

  it.each([
    ['xs', 'h-6'],
    ['sm', 'h-8'],
    ['md', 'h-10'],
    ['lg', 'h-12'],
  ] as const)('exposes the %s size without changing native button behavior', (size, height) => {
    const wrapper = mount(MkButton, {
      props: { size },
      slots: { default: 'Continue' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.classes()).toContain(height)
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('forwards native button attributes and events', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MkButton, {
      props: {
        'aria-label': 'Save changes',
        name: 'intent',
        value: 'save',
        type: 'submit',
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-label')).toBe('Save changes')
    expect(wrapper.attributes('name')).toBe('intent')
    expect(wrapper.attributes('value')).toBe('save')
    expect(wrapper.attributes('type')).toBe('submit')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('becomes busy and non-interactive while loading', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MkButton, {
      props: { loading: true, onClick },
      slots: {
        loader: '<span>Loading</span>',
        default: 'Save',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-mk-loading')).toBe('')
    expect(wrapper.text()).toBe('LoadingSave')
    expect(onClick).not.toHaveBeenCalled()
  })

  it.each(['xs', 'sm', 'md', 'lg'] as const)(
    'renders a decorative %s Spinner by default while loading',
    (size) => {
      const wrapper = mount(MkButton, {
        props: { loading: true, size },
        slots: { default: 'Save' },
      })

      const spinner = wrapper.get('.mk-spinner')

      expect(spinner.attributes('data-mk-size')).toBe(size)
      expect(spinner.attributes('aria-hidden')).toBe('true')
      expect(spinner.attributes('role')).toBeUndefined()
      expect(spinner.attributes('aria-label')).toBeUndefined()
      expect(wrapper.text()).toBe('Save')
    },
  )

  it('replaces the default Spinner when the loader slot is provided', () => {
    const wrapper = mount(MkButton, {
      props: { loading: true },
      slots: {
        loader: '<span class="custom-loader">Please wait</span>',
        default: 'Save',
      },
    })

    expect(wrapper.find('.mk-spinner').exists()).toBe(false)
    expect(wrapper.get('.custom-loader').text()).toBe('Please wait')
  })

  it('casts native boolean attributes written in templates', () => {
    const wrapper = mount(
      defineComponent({
        components: { MkButton },
        template: '<MkButton disabled>Disabled</MkButton>',
      }),
    )

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('renders content slots in their documented order', () => {
    const wrapper = mount(MkButton, {
      slots: {
        leading: '<span>Before</span>',
        default: '<span>Label</span>',
        trailing: '<span>After</span>',
      },
    })

    expect(wrapper.text()).toBe('BeforeLabelAfter')
  })

  it('merges local ui and consumer classes after the CVA recipe', () => {
    const wrapper = mount(MkButton, {
      props: {
        color: 'primary',
        variant: 'default',
        ui: { base: 'bg-emerald-600 rounded-full' },
        class: 'checkout-action bg-fuchsia-600 h-14',
      },
    })

    expect(wrapper.classes()).toContain('checkout-action')
    expect(wrapper.classes()).toContain('bg-fuchsia-600')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('h-14')
    expect(wrapper.classes()).not.toContain('bg-primary')
    expect(wrapper.classes()).not.toContain('bg-emerald-600')
    expect(wrapper.classes()).not.toContain('h-10')
  })

  it('applies global axes, compound overrides, and defaults from the Vue plugin', () => {
    const wrapper = mount(MkButton, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              button: {
                base: 'font-bold',
                variants: {
                  color: {
                    destructive: 'tracking-wide',
                  },
                  variant: {
                    outline: 'rounded-full',
                  },
                  size: {
                    lg: 'h-14',
                  },
                },
                compoundVariants: [
                  {
                    color: ['primary', 'destructive'],
                    variant: ['outline', 'soft'],
                    class: 'border-fuchsia-400 text-fuchsia-700',
                  },
                ],
                defaultVariants: {
                  color: 'destructive',
                  variant: 'outline',
                  size: 'lg',
                },
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.attributes('data-mk-color')).toBe('destructive')
    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.classes()).toContain('font-bold')
    expect(wrapper.classes()).toContain('tracking-wide')
    expect(wrapper.classes()).toContain('border-fuchsia-400')
    expect(wrapper.classes()).toContain('text-fuchsia-700')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('h-14')
    expect(wrapper.classes()).not.toContain('border-destructive')
    expect(wrapper.classes()).not.toContain('text-destructive')
    expect(wrapper.classes()).not.toContain('rounded-xl')
    expect(wrapper.classes()).not.toContain('h-12')
  })

  it('keeps native attributes in the exported component type', () => {
    expectTypeOf<Parameters<typeof MkButton>[0]['aria-label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Parameters<typeof MkButton>[0]['form']>().toEqualTypeOf<string | undefined>()
  })
})
