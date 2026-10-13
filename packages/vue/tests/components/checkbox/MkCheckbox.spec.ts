import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { checkboxSizes, checkboxVariants, createModeKit, MkCheckbox } from '../../../src/index.js'

describe('MkCheckbox', () => {
  it('renders an accessible unchecked control with its label and description', () => {
    const wrapper = mount(MkCheckbox, {
      props: {
        id: 'updates',
        label: 'Product updates',
        description: 'Receive occasional release notes.',
      },
    })

    const control = wrapper.get('[role="checkbox"]')
    const label = wrapper.get('label')
    const description = wrapper.get('p')

    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-variant')).toBe('default')
    expect(control.attributes('id')).toBe('updates')
    expect(control.attributes('aria-checked')).toBe('false')
    expect(control.attributes('data-state')).toBe('unchecked')
    expect(control.attributes('aria-describedby')).toBe('updates-description')
    expect(control.classes()).toEqual(
      expect.arrayContaining(['mk:size-5', 'mk:rounded-md', 'mk:border-input', 'mk:bg-background']),
    )
    expect(label.attributes('for')).toBe('updates')
    expect(label.classes()).toContain('mk-label')
    expect(label.attributes('data-mk-size')).toBe('md')
    expect(label.text()).toBe('Product updates')
    expect(description.attributes('id')).toBe('updates-description')
    expect(description.text()).toBe('Receive occasional release notes.')
  })

  it('updates an uncontrolled value through Reka UI behavior', async () => {
    const wrapper = mount(MkCheckbox, {
      props: { defaultValue: false, label: 'Remember me' },
    })
    const control = wrapper.get('[role="checkbox"]')

    await control.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(control.attributes('aria-checked')).toBe('true')
    expect(control.attributes('data-state')).toBe('checked')
    expect(control.find('.mk-checkbox__indicator').exists()).toBe(true)
    expect(control.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('renders and clears the indeterminate state', async () => {
    const wrapper = mount(MkCheckbox, {
      props: { defaultValue: 'indeterminate', 'aria-label': 'Select all rows' },
    })
    const control = wrapper.get('[role="checkbox"]')

    expect(control.attributes('aria-checked')).toBe('mixed')
    expect(control.attributes('data-state')).toBe('indeterminate')
    expect(control.find('path').attributes('d')).toBe('M3 8h10')

    await control.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(control.attributes('data-state')).toBe('checked')
  })

  it('forwards form and accessibility attributes to the control', () => {
    const wrapper = mount(MkCheckbox, {
      props: {
        id: 'terms',
        name: 'terms',
        value: 'accepted',
        required: true,
        'aria-label': 'Accept terms',
        'aria-describedby': 'terms-error',
        'aria-invalid': 'true',
      },
    })
    const control = wrapper.get('[role="checkbox"]')

    expect(control.attributes('aria-label')).toBe('Accept terms')
    expect(control.attributes('aria-describedby')).toBe('terms-error')
    expect(control.attributes('aria-invalid')).toBe('true')
    expect(control.attributes('aria-required')).toBe('true')
    expect(control.classes()).toContain('mk:aria-invalid:border-red-700')
    expect(control.classes()).toContain('mk:dark:aria-invalid:border-red-400')
  })

  it('uses MkLabel for required field presentation', () => {
    const wrapper = mount(MkCheckbox, {
      props: { required: true, label: 'Accept terms' },
    })

    expect(wrapper.get('label').classes()).toContain('mk-label')
    expect(wrapper.get('label').attributes('data-required')).toBe('')
    expect(wrapper.get('.mk-label__required').attributes('aria-hidden')).toBe('true')
  })

  it('renders a fully selectable card surface with shared label behavior', async () => {
    const wrapper = mount(MkCheckbox, {
      props: {
        id: 'workspace',
        defaultValue: false,
        label: 'Create a workspace',
        description: 'Invite collaborators and organize projects.',
        variant: 'card',
      },
    })
    const control = wrapper.get('[role="checkbox"]')
    const labelText = wrapper.get('#workspace-label')

    expect((wrapper.element as HTMLElement).tagName).toBe('LABEL')
    expect(wrapper.attributes('for')).toBe('workspace')
    expect(wrapper.attributes('data-mk-variant')).toBe('card')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-label',
        'mk:w-full',
        'mk:rounded-xl',
        'mk:border-border',
        'mk:bg-surface',
        'mk:p-4',
        'mk:has-data-[state=checked]:bg-primary/10',
      ]),
    )
    expect(control.attributes('aria-labelledby')).toBe('workspace-label')
    expect(control.attributes('aria-describedby')).toBe('workspace-description')
    expect(control.classes()).toContain('mk:focus-visible:outline-none')
    expect(labelText.text()).toBe('Create a workspace')

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(control.attributes('data-state')).toBe('checked')
  })

  it('prevents interaction and dims the complete field when disabled', async () => {
    const wrapper = mount(MkCheckbox, {
      props: { disabled: true, label: 'Unavailable', description: 'Ask an administrator.' },
    })
    const control = wrapper.get('[role="checkbox"]')

    await control.trigger('click')

    expect(wrapper.attributes('data-mk-disabled')).toBe('')
    expect(wrapper.classes()).toContain('mk:data-[mk-disabled]:opacity-50')
    expect(control.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('label').attributes('data-disabled')).toBe('')
    expect(wrapper.get('p').attributes('data-disabled')).toBe('')
  })

  it.each([
    ['sm', 'mk:size-4', 'mk:rounded-sm'],
    ['md', 'mk:size-5', 'mk:rounded-md'],
    ['lg', 'mk:size-6', 'mk:rounded-lg'],
  ] as const)('resolves the %s size coherently', (size, dimension, radius) => {
    const wrapper = mount(MkCheckbox, { props: { size } })
    const control = wrapper.get('[role="checkbox"]')

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(control.classes()).toContain(dimension)
    expect(control.classes()).toContain(radius)
  })

  it('supports custom slots and local slot classes', () => {
    const wrapper = mount(MkCheckbox, {
      props: {
        defaultValue: true,
        ui: {
          base: 'w-full',
          indicator: 'indicator-class',
          label: 'label-class',
          description: 'description-class',
        },
      },
      slots: {
        indicator: ({ state }) => `State: ${String(state)}`,
        label: () => 'Custom label',
        description: () => 'Custom description',
      },
    })

    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.get('.mk-checkbox__indicator').classes()).toContain('indicator-class')
    expect(wrapper.get('.mk-checkbox__indicator').text()).toBe('State: true')
    expect(wrapper.get('label').classes()).toContain('label-class')
    expect(wrapper.get('label').text()).toBe('Custom label')
    expect(wrapper.get('p').classes()).toContain('description-class')
  })

  it('uses global defaults and slot configuration without hiding built-in classes', () => {
    const wrapper = mount(MkCheckbox, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              checkbox: {
                base: 'items-center',
                slots: {
                  control: 'border-2',
                  label: 'font-semibold',
                },
                variants: {
                  size: {
                    lg: 'gap-4',
                  },
                  variant: {
                    card: 'shadow-lg',
                  },
                },
                defaultVariants: {
                  size: 'lg',
                  variant: 'card',
                },
              },
            },
          }),
        ],
      },
      props: { label: 'Configured' },
    })
    const control = wrapper.get('[role="checkbox"]')

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-variant')).toBe('card')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['items-center', 'gap-4', 'shadow-lg', 'mk:gap-3']),
    )
    expect(control.classes()).toEqual(
      expect.arrayContaining(['border-2', 'mk:border', 'mk:size-6']),
    )
    expect(wrapper.get('[id$="-label"]').classes()).toContain('font-semibold')
  })

  it('exports the finite size contract', () => {
    expect(checkboxSizes).toEqual(['sm', 'md', 'lg'])
    expect(checkboxVariants).toEqual(['default', 'card'])
  })
})
