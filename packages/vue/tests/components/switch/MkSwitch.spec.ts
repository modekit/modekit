import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import {
  createModeKit,
  MkSwitch,
  switchAlignments,
  switchSizes,
  switchVariants,
} from '../../../src/index.js'

describe('MkSwitch', () => {
  it('renders an accessible off control with its label and description', () => {
    const wrapper = mount(MkSwitch, {
      props: {
        id: 'updates',
        label: 'Product updates',
        description: 'Receive occasional release notes.',
      },
    })

    const control = wrapper.get('[role="switch"]')

    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-variant')).toBe('default')
    expect(wrapper.attributes('data-mk-align')).toBe('right')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mk:flex-row', 'mk:items-start']))
    expect(control.attributes('id')).toBe('updates')
    expect(control.attributes('aria-checked')).toBe('false')
    expect(control.attributes('data-state')).toBe('unchecked')
    expect(control.attributes('aria-labelledby')).toBe('updates-label')
    expect(control.attributes('aria-describedby')).toBe('updates-description')
    expect(control.classes()).toEqual(expect.arrayContaining(['mk:h-6', 'mk:w-11']))
    expect(wrapper.get('label').attributes('for')).toBe('updates')
    expect(wrapper.get('label').text()).toBe('Product updates')
    expect(wrapper.get('p').text()).toBe('Receive occasional release notes.')
    expect(wrapper.get('.mk-switch__thumb').classes()).toContain(
      'mk:data-[state=checked]:translate-x-5',
    )
  })

  it('updates an uncontrolled value through Reka UI behavior', async () => {
    const wrapper = mount(MkSwitch, {
      props: { defaultValue: false, label: 'Notifications' },
    })
    const control = wrapper.get('[role="switch"]')

    await control.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(control.attributes('aria-checked')).toBe('true')
    expect(control.attributes('data-state')).toBe('checked')
    expect(wrapper.get('.mk-switch__thumb').attributes('data-state')).toBe('checked')
  })

  it('forwards form and accessibility attributes to the control', () => {
    const wrapper = mount(MkSwitch, {
      props: {
        id: 'digest',
        name: 'digest',
        value: 'enabled',
        required: true,
        'aria-label': 'Enable digest',
        'aria-describedby': 'digest-error',
        'aria-invalid': 'true',
      },
    })
    const control = wrapper.get('[role="switch"]')

    expect(control.attributes('aria-label')).toBe('Enable digest')
    expect(control.attributes('aria-describedby')).toBe('digest-error')
    expect(control.attributes('aria-invalid')).toBe('true')
    expect(control.attributes('aria-required')).toBe('true')
    expect(control.classes()).toContain('mk:aria-invalid:ring-red-700')
  })

  it('renders a fully selectable card surface', async () => {
    const wrapper = mount(MkSwitch, {
      props: {
        id: 'workspace',
        defaultValue: false,
        label: 'Public workspace',
        description: 'Let anyone with the link view this workspace.',
        variant: 'card',
      },
    })
    const control = wrapper.get('[role="switch"]')

    expect((wrapper.element as HTMLElement).tagName).toBe('LABEL')
    expect(wrapper.attributes('for')).toBe('workspace')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'mk-label',
        'mk:w-full',
        'mk:rounded-xl',
        'mk:p-4',
        'mk:has-data-[state=checked]:bg-primary/10',
      ]),
    )
    expect(control.classes()).toContain('mk:focus-visible:outline-none')

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(control.attributes('data-state')).toBe('checked')
  })

  it('places the control on the requested side of its content', () => {
    const wrapper = mount(MkSwitch, {
      props: { align: 'left', label: 'Control first', description: 'Content follows.' },
    })

    expect(wrapper.attributes('data-mk-align')).toBe('left')
    expect(wrapper.classes()).toContain('mk:flex-row-reverse')
  })

  it('prevents interaction and dims the complete field when disabled', async () => {
    const wrapper = mount(MkSwitch, {
      props: { disabled: true, label: 'Unavailable', description: 'Ask an administrator.' },
    })
    const control = wrapper.get('[role="switch"]')

    await control.trigger('click')

    expect(wrapper.attributes('data-mk-disabled')).toBe('')
    expect(wrapper.classes()).toContain('mk:data-[mk-disabled]:opacity-50')
    expect(control.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('uses the ModeKit Spinner and busy semantics while loading', async () => {
    const wrapper = mount(MkSwitch, {
      props: { loading: true, defaultValue: true, label: 'Saving preference', size: 'lg' },
    })
    const control = wrapper.get('[role="switch"]')

    await control.trigger('click')

    expect(wrapper.attributes('data-mk-loading')).toBe('')
    expect(wrapper.classes()).toContain('mk:data-[mk-loading]:cursor-progress')
    expect(control.attributes('disabled')).toBeDefined()
    expect(control.attributes('aria-busy')).toBe('true')
    expect(control.attributes('aria-checked')).toBe('true')
    expect(wrapper.get('.mk-switch__thumb').attributes('data-state')).toBe('checked')
    expect(control.attributes('data-mk-loading')).toBe('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('.mk-switch__loader').classes()).toEqual(
      expect.arrayContaining([
        'mk:size-3.5',
        'mk:flex',
        'mk:items-center',
        'mk:justify-center',
        'mk:leading-none',
      ]),
    )
    expect(wrapper.get('.mk-spinner').attributes('aria-hidden')).toBe('true')
  })

  it('replaces the default Spinner with the loader slot', () => {
    const wrapper = mount(MkSwitch, {
      props: { loading: true },
      slots: { loader: ({ loading }) => (loading ? 'Saving' : 'Idle') },
    })

    expect(wrapper.get('.mk-switch__loader').text()).toBe('Saving')
    expect(wrapper.find('.mk-spinner').exists()).toBe(false)
  })

  it('renders dedicated checked and unchecked thumb icons', async () => {
    const wrapper = mount(MkSwitch, {
      props: { defaultValue: false },
      slots: {
        'checked-icon': () => h('svg', { 'data-icon': 'checked' }),
        'unchecked-icon': () => h('svg', { 'data-icon': 'unchecked' }),
      },
    })
    const control = wrapper.get('[role="switch"]')

    expect(wrapper.get('.mk-switch__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[data-icon="unchecked"]')).toBeDefined()

    await control.trigger('click')

    expect(wrapper.get('[data-icon="checked"]')).toBeDefined()
    expect(wrapper.find('[data-icon="unchecked"]').exists()).toBe(false)
  })

  it.each([
    ['sm', 'mk:h-5', 'mk:w-9', 'mk:size-4'],
    ['md', 'mk:h-6', 'mk:w-11', 'mk:size-5'],
    ['lg', 'mk:h-7', 'mk:w-13', 'mk:size-6'],
  ] as const)('resolves the %s size coherently', (size, height, width, thumbSize) => {
    const wrapper = mount(MkSwitch, { props: { size } })
    const control = wrapper.get('[role="switch"]')

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(control.classes()).toEqual(expect.arrayContaining([height, width]))
    expect(wrapper.get('.mk-switch__thumb').classes()).toContain(thumbSize)
  })

  it('supports custom slots and local slot classes', () => {
    const wrapper = mount(MkSwitch, {
      props: {
        defaultValue: true,
        ui: {
          base: 'w-full',
          thumb: 'thumb-class',
          label: 'label-class',
          description: 'description-class',
        },
      },
      slots: {
        thumb: ({ checked }) => (checked ? 'On' : 'Off'),
        label: () => 'Custom label',
        description: () => 'Custom description',
      },
    })

    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.get('.mk-switch__thumb').classes()).toContain('thumb-class')
    expect(wrapper.get('.mk-switch__thumb').text()).toBe('On')
    expect(wrapper.get('label').classes()).toContain('label-class')
    expect(wrapper.get('p').classes()).toContain('description-class')
  })

  it('uses global defaults and slot configuration without hiding built-in classes', () => {
    const wrapper = mount(MkSwitch, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              switch: {
                base: 'items-center',
                slots: {
                  control: 'ring-2',
                  label: 'font-semibold',
                },
                variants: {
                  size: { lg: 'gap-4' },
                  variant: { card: 'shadow-lg' },
                  align: { left: 'justify-end' },
                },
                defaultVariants: {
                  size: 'lg',
                  variant: 'card',
                  align: 'left',
                },
              },
            },
          }),
        ],
      },
      props: { label: 'Configured' },
    })
    const control = wrapper.get('[role="switch"]')

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-variant')).toBe('card')
    expect(wrapper.attributes('data-mk-align')).toBe('left')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'items-center',
        'gap-4',
        'shadow-lg',
        'justify-end',
        'mk:gap-3',
        'mk:flex-row-reverse',
      ]),
    )
    expect(control.classes()).toEqual(expect.arrayContaining(['ring-2', 'mk:h-7', 'mk:w-13']))
    expect(wrapper.get('[id$="-label"]').classes()).toContain('font-semibold')
  })

  it('exports the finite size, variant, and alignment contracts', () => {
    expect(switchSizes).toEqual(['sm', 'md', 'lg'])
    expect(switchVariants).toEqual(['default', 'card'])
    expect(switchAlignments).toEqual(['left', 'right'])
  })
})
