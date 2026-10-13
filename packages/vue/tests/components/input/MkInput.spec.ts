import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import {
  createModeKit,
  inputFloatingPositions,
  inputSizes,
  inputVariants,
  MkInput,
} from '../../../src/index.js'

describe('MkInput', () => {
  it('renders a semantic native input with forwarded attributes and clear placeholder styling', () => {
    const wrapper = mount(MkInput, {
      props: {
        id: 'email',
        name: 'email',
        type: 'email',
        placeholder: 'name@example.com',
        autocomplete: 'email',
      },
    })
    const input = wrapper.get('input')

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-input',
        'mk:h-10',
        'mk:border-input',
        'mk:bg-background',
        'mk:rounded-lg',
      ]),
    )
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-variant')).toBe('outline')
    expect((input.element as HTMLInputElement).type).toBe('email')
    expect(input.attributes('id')).toBe('email')
    expect(input.attributes('name')).toBe('email')
    expect(input.attributes('placeholder')).toBe('name@example.com')
    expect(input.attributes('autocomplete')).toBe('email')
    expect(input.classes()).toEqual(
      expect.arrayContaining([
        'mk-input__control',
        'mk:h-full',
        'mk:px-3',
        'mk:placeholder:text-muted-foreground/60',
      ]),
    )
  })

  it('renders and updates a controlled value', async () => {
    const wrapper = mount(MkInput, { props: { modelValue: 'Initial' } })
    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).value).toBe('Initial')

    await input.setValue('Updated')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Updated']])
    await wrapper.setProps({ modelValue: 'Confirmed' })
    expect((input.element as HTMLInputElement).value).toBe('Confirmed')
  })

  it('supports an uncontrolled initial value', async () => {
    const wrapper = mount(MkInput, { props: { defaultValue: 'Initial' } })
    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).value).toBe('Initial')

    await input.setValue('Updated')

    expect((input.element as HTMLInputElement).value).toBe('Updated')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Updated']])
  })

  it('preserves native input, focus, and blur listeners', async () => {
    const onInput = vi.fn()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(MkInput, { attrs: { onInput, onFocus, onBlur } })
    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.setValue('Search')
    await input.trigger('blur')

    expect(onFocus).toHaveBeenCalledOnce()
    expect(onInput).toHaveBeenCalledOnce()
    expect(onBlur).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:modelValue')).toEqual([['Search']])
  })

  it('forwards disabled, readonly, required, loading, and invalid states without rendering error text', () => {
    const wrapper = mount(MkInput, {
      props: {
        disabled: true,
        readonly: true,
        required: true,
        loading: true,
        invalid: true,
      },
    })
    const input = wrapper.get('input')

    expect(wrapper.attributes('data-mk-disabled')).toBe('')
    expect(wrapper.attributes('data-mk-readonly')).toBe('')
    expect(wrapper.attributes('data-mk-loading')).toBe('')
    expect(wrapper.attributes('data-mk-invalid')).toBe('')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('readonly')).toBeDefined()
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-busy')).toBe('true')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('preserves an explicit aria-invalid value and reflects it on the visual root', () => {
    const wrapper = mount(MkInput, { props: { 'aria-invalid': 'grammar' } })

    expect(wrapper.attributes('data-mk-invalid')).toBe('')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('grammar')
  })

  it.each([
    ['sm', 'mk:rounded-md', 'mk:h-8', 'mk:px-2.5'],
    ['md', 'mk:rounded-lg', 'mk:h-10', 'mk:px-3'],
    ['lg', 'mk:rounded-xl', 'mk:h-12', 'mk:px-4'],
  ] as const)(
    'resolves the %s size across the root and control',
    (size, radius, height, padding) => {
      const wrapper = mount(MkInput, { props: { size } })
      const input = wrapper.get('input')

      expect(wrapper.attributes('data-mk-size')).toBe(size)
      expect(wrapper.classes()).toEqual(expect.arrayContaining([radius, height]))
      expect(input.classes()).toEqual(expect.arrayContaining(['mk:h-full', padding]))
    },
  )

  it.each([
    ['sm', 'mk:h-8'],
    ['md', 'mk:h-10'],
    ['lg', 'mk:h-12'],
  ] as const)('keeps the %s height and padding when border floating is enabled', (size, height) => {
    const wrapper = mount(MkInput, { props: { floating: 'border', label: 'Name', size } })
    const input = wrapper.get('input')

    expect(wrapper.classes().filter((className) => className.startsWith('mk:h-'))).toEqual([height])
    expect(input.classes().some((className) => className.startsWith('mk:pt-'))).toBe(false)
    expect(input.classes().some((className) => className.startsWith('mk:pb-'))).toBe(false)
  })

  it.each([
    ['outline', ['mk:border-input', 'mk:bg-background']],
    ['soft', ['mk:border-0', 'mk:bg-muted']],
    ['subtle', ['mk:border-border', 'mk:bg-muted/50']],
    ['ghost', ['mk:border-0', 'mk:bg-transparent', 'mk:hover:bg-muted/50']],
    ['plain', ['mk:border-0', 'mk:bg-transparent']],
  ] as const)('renders the %s chrome variant', (variant, classes) => {
    const wrapper = mount(MkInput, { props: { variant } })

    expect(wrapper.attributes('data-mk-variant')).toBe(variant)
    expect(wrapper.classes()).toEqual(expect.arrayContaining([...classes]))

    if (variant === 'plain') {
      expect(
        wrapper.classes().some((className) => className.includes('has-focus-visible:after')),
      ).toBe(false)
    } else {
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining([
          "mk:after:content-['']",
          'mk:after:opacity-0',
          'mk:after:transition-[opacity,border-color]',
          'mk:after:duration-150',
          'mk:has-focus-visible:after:border-ring',
          'mk:has-focus-visible:after:opacity-100',
          'mk:data-[mk-invalid]:has-focus-visible:after:border-destructive',
          'mk:motion-reduce:after:transition-none',
        ]),
      )
    }
  })

  it('renders leading and trailing slots with coherent control padding', () => {
    const wrapper = mount(MkInput, {
      props: { size: 'md' },
      slots: {
        leading: ({ size }) => `Lead ${size}`,
        trailing: ({ variant }) => `Trail ${variant}`,
      },
    })
    const input = wrapper.get('input')

    expect(wrapper.get('.mk-input__leading').text()).toBe('Lead md')
    expect(wrapper.get('.mk-input__trailing').text()).toBe('Trail outline')
    expect(input.classes()).toEqual(expect.arrayContaining(['mk:pl-9', 'mk:pr-9']))
  })

  it('uses a decorative ModeKit spinner in place of leading content while loading', () => {
    const wrapper = mount(MkInput, {
      props: { loading: true, size: 'lg' },
      slots: { leading: () => 'Search', trailing: () => 'USD' },
    })
    const spinner = wrapper.get('.mk-spinner')

    expect(wrapper.get('.mk-input__leading').text()).not.toContain('Search')
    expect(wrapper.get('.mk-input__trailing').text()).toBe('USD')
    expect(spinner.attributes('aria-hidden')).toBe('true')
    expect(spinner.attributes('role')).toBeUndefined()
    expect(spinner.attributes('data-mk-size')).toBe('lg')
    expect(spinner.classes()).toContain('mk-input__spinner')
    expect(wrapper.get('input').attributes('aria-busy')).toBe('true')
  })

  it('supports a custom loader slot', () => {
    const wrapper = mount(MkInput, {
      props: { loading: true },
      slots: { loader: ({ loading }) => (loading ? 'Checking' : 'Idle') },
    })

    expect(wrapper.get('.mk-input__leading').text()).toBe('Checking')
    expect(wrapper.find('.mk-spinner').exists()).toBe(false)
  })

  it('does not render a label unless a floating position is selected', () => {
    const withLabelProp = mount(MkInput, { props: { label: 'Email address' } })
    const withLabelSlot = mount(MkInput, { slots: { label: () => 'Email address' } })

    expect(withLabelProp.find('label').exists()).toBe(false)
    expect(withLabelSlot.find('label').exists()).toBe(false)
    expect(withLabelProp.get('input').attributes('id')).toBeUndefined()
  })

  it('keeps an active inside-floating label within the selected control size', () => {
    const wrapper = mount(MkInput, {
      props: { defaultValue: 'modekit', floating: 'inside', label: 'Project name', size: 'md' },
    })
    const input = wrapper.get('input')
    const label = wrapper.get('label')

    expect(wrapper.attributes('data-mk-floating')).toBe('inside')
    expect(wrapper.classes()).toContain('mk:h-10')
    expect(input.classes()).toEqual(expect.arrayContaining(['mk:pt-4', 'mk:pb-0.5']))
    expect(label.classes()).toEqual(
      expect.arrayContaining(['mk:z-10', 'mk:top-1', 'mk:origin-top-left', 'mk:scale-75']),
    )
    expect(label.classes()).not.toContain('mk:bg-inherit')
  })

  it('renders an associated border-floating label and activates it on focus', async () => {
    const wrapper = mount(MkInput, { props: { floating: 'border', label: 'Email address' } })
    const input = wrapper.get('input')
    const label = wrapper.get('label')

    expect(wrapper.attributes('data-mk-floating')).toBe('border')
    expect(wrapper.attributes('data-mk-floating-active')).toBeUndefined()
    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(label.text()).toBe('Email address')
    expect(label.classes()).toEqual(expect.arrayContaining(['mk:top-1/2', 'mk:scale-100']))
    expect(wrapper.classes()).toContain('mk:h-10')
    expect(wrapper.classes()).not.toContain('mk:h-12')
    expect(input.classes()).toEqual(expect.arrayContaining(['mk:box-border', 'mk:h-full']))
    expect(input.classes()).not.toContain('mk:pt-4')

    await input.trigger('focus')

    expect(wrapper.attributes('data-mk-floating-active')).toBe('')
    expect(label.classes()).toEqual(
      expect.arrayContaining([
        'mk:top-0',
        'mk:-ml-1',
        'mk:-translate-y-1/2',
        'mk:scale-75',
        'mk:bg-inherit',
      ]),
    )

    await input.trigger('blur')
    expect(wrapper.attributes('data-mk-floating-active')).toBeUndefined()
  })

  it('keeps a floating label active when the input has a value', async () => {
    const wrapper = mount(MkInput, {
      props: { defaultValue: 'modekit', floating: 'border', label: 'Project name' },
    })
    const input = wrapper.get('input')

    expect(wrapper.attributes('data-mk-floating-active')).toBe('')

    await input.setValue('')
    await input.trigger('blur')

    expect(wrapper.attributes('data-mk-floating-active')).toBeUndefined()
  })

  it('supports a custom floating-label slot and aligns it after a leading slot', () => {
    const wrapper = mount(MkInput, {
      props: { floating: 'border', label: 'Ignored', size: 'lg' },
      slots: {
        leading: () => '@',
        label: ({ floating, label, size }) => `${String(label)} (${size}, ${floating})`,
      },
    })
    const label = wrapper.get('label')

    expect(label.text()).toBe('Ignored (lg, border)')
    expect(label.classes()).toContain('mk:left-10')
  })

  it('merges global, local, slot, and native class overrides in order', () => {
    const wrapper = mount(MkInput, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              input: {
                base: 'mk:border-2',
                slots: {
                  input: 'mk:font-medium',
                  leading: 'mk:text-foreground',
                },
                variants: {
                  size: {
                    lg: 'mk:rounded-2xl',
                  },
                  variant: {
                    soft: 'mk:shadow-raised',
                  },
                },
                defaultVariants: {
                  size: 'lg',
                  variant: 'soft',
                },
              },
            },
          }),
        ],
      },
      props: {
        ui: { base: 'mk:bg-surface', input: 'mk:text-primary' },
        class: 'mk:rounded-none',
      },
      slots: { leading: () => '@' },
    })
    const input = wrapper.get('input')

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-variant')).toBe('soft')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk:border-2',
        'mk:shadow-raised',
        'mk:bg-surface',
        'mk:rounded-none',
      ]),
    )
    expect(wrapper.classes()).not.toContain('mk:rounded-xl')
    expect(input.classes()).toEqual(expect.arrayContaining(['mk:font-medium', 'mk:text-primary']))
    expect(input.classes()).not.toContain('mk:text-foreground')
    expect(wrapper.get('.mk-input__leading').classes()).toContain('mk:text-foreground')
  })

  it('exports the finite floating, size, and variant contracts', () => {
    expect(inputFloatingPositions).toEqual(['inside', 'border'])
    expect(inputSizes).toEqual(['sm', 'md', 'lg'])
    expect(inputVariants).toEqual(['outline', 'soft', 'subtle', 'ghost', 'plain'])
  })
})
