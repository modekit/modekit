import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import {
  createModeKit,
  MkRadioGroup,
  radioGroupOrientations,
  radioGroupSizes,
  radioGroupVariants,
} from '../../../src/index.js'

const items = [
  { label: 'Starter', value: 'starter', description: 'For personal projects.' },
  { label: 'Team', value: 'team', description: 'For growing teams.' },
  { label: 'Enterprise', value: 'enterprise', disabled: true },
] as const

describe('MkRadioGroup', () => {
  it('renders an accessible group with labelled and described options', () => {
    const wrapper = mount(MkRadioGroup, {
      props: {
        id: 'plan',
        items,
        label: 'Plan',
        description: 'Choose one workspace plan.',
      },
    })
    const group = wrapper.get('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.attributes('data-mk-variant')).toBe('default')
    expect(wrapper.attributes('data-mk-orientation')).toBe('vertical')
    expect(group.attributes('id')).toBe('plan')
    expect(group.attributes('aria-labelledby')).toBe('plan-label')
    expect(group.attributes('aria-describedby')).toBe('plan-description')
    expect(wrapper.get('#plan-label').text()).toBe('Plan')
    expect(wrapper.get('#plan-description').text()).toBe('Choose one workspace plan.')
    expect(radios).toHaveLength(3)
    expect(radios[0]?.attributes('aria-labelledby')).toBe('plan-0-label')
    expect(radios[0]?.attributes('aria-describedby')).toBe('plan-0-description')
    expect(radios[2]?.attributes('disabled')).toBeDefined()
  })

  it('updates an uncontrolled value through Reka UI behavior', async () => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, defaultValue: 'starter', 'aria-label': 'Plan' },
    })
    const radios = wrapper.findAll('[role="radio"]')

    expect(radios[0]?.attributes('aria-checked')).toBe('true')
    expect(radios[1]?.attributes('aria-checked')).toBe('false')

    await radios[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['team']])
    expect(radios[0]?.attributes('aria-checked')).toBe('false')
    expect(radios[1]?.attributes('aria-checked')).toBe('true')
    expect(radios[1]?.find('.mk-radio-group__indicator').exists()).toBe(true)
  })

  it('forwards form and accessibility attributes to the group', () => {
    const wrapper = mount(MkRadioGroup, {
      props: {
        items,
        name: 'plan',
        required: true,
        'aria-label': 'Billing plan',
        'aria-describedby': 'plan-error',
        'aria-invalid': 'true',
      },
    })
    const group = wrapper.get('[role="radiogroup"]')

    expect(group.attributes('aria-label')).toBe('Billing plan')
    expect(group.attributes('aria-describedby')).toBe('plan-error')
    expect(group.attributes('aria-invalid')).toBe('true')
    expect(group.attributes('aria-required')).toBe('true')
    expect(wrapper.get('[role="radio"]').attributes('aria-invalid')).toBe('true')
  })

  it('marks the group label as required', () => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, required: true, label: 'Plan' },
    })

    expect(wrapper.get('.mk-label__required').attributes('aria-hidden')).toBe('true')
  })

  it('supports horizontal card options', () => {
    const wrapper = mount(MkRadioGroup, {
      props: {
        items,
        defaultValue: 'team',
        variant: 'card',
        orientation: 'horizontal',
        'aria-label': 'Plan',
      },
    })
    const options = wrapper.get('[role="radiogroup"]')
    const cards = wrapper.findAll('label.mk-radio-group__item')

    expect(options.classes()).toEqual(expect.arrayContaining(['mk:flex-row', 'mk:flex-wrap']))
    expect(cards[0]?.classes()).toEqual(
      expect.arrayContaining(['mk:flex-1', 'mk:rounded-xl', 'mk:p-4']),
    )
    expect(cards[1]?.classes()).toContain('mk:has-data-[state=checked]:bg-primary/10')
    expect(wrapper.findAll('[role="radio"]')[0]?.classes()).toContain(
      'mk:focus-visible:outline-none',
    )
  })

  it('prevents interaction when the complete group is disabled', async () => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, disabled: true, defaultValue: 'starter', label: 'Plan' },
    })
    const radios = wrapper.findAll('[role="radio"]')

    await radios[1]?.trigger('click')

    expect(wrapper.attributes('data-mk-disabled')).toBe('')
    expect(radios.every((radio) => radio.attributes('disabled') !== undefined)).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it.each([
    ['sm', 'mk:size-4', 'mk:size-1.5'],
    ['md', 'mk:size-5', 'mk:size-2'],
    ['lg', 'mk:size-6', 'mk:size-2.5'],
  ] as const)('resolves the %s size coherently', (size, controlSize, indicatorSize) => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, size, defaultValue: 'starter', 'aria-label': 'Plan' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(wrapper.get('[role="radio"]').classes()).toContain(controlSize)
    expect(wrapper.get('.mk-radio-group__indicator').classes()).toContain(indicatorSize)
  })

  it.each([
    ['table', 'mk:overflow-hidden', 'mk:has-data-[state=checked]:ring-primary/60'],
    ['segmented', 'mk:bg-neutral-100', 'mk:has-data-[state=checked]:shadow-raised'],
    ['pills', 'mk:gap-2', 'mk:has-data-[state=checked]:bg-primary'],
  ] as const)('renders the %s selection surface', (variant, optionsClass, itemClass) => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, variant, defaultValue: 'team', 'aria-label': 'Plan' },
    })

    expect(wrapper.get('[role="radiogroup"]').classes()).toContain(optionsClass)
    expect(wrapper.findAll('.mk-radio-group__item')[1]?.classes()).toContain(itemClass)
  })

  it('keeps table selection borders inside the wrapper and rounds edge rows', () => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, variant: 'table', defaultValue: 'starter', 'aria-label': 'Plan' },
    })
    const rows = wrapper.findAll('.mk-radio-group__item')

    expect(rows[0]?.classes()).toEqual(
      expect.arrayContaining([
        'mk:box-border',
        'mk:first:rounded-t-xl',
        'mk:has-data-[state=checked]:ring-inset',
      ]),
    )
    expect(rows[2]?.classes()).toContain('mk:last:rounded-b-xl')
  })

  it.each([
    ['horizontal', '88px', '4px', '72px', '32px'],
    ['vertical', '4px', '40px', '180px', '40px'],
  ] as const)(
    'slides the segmented indicator in %s orientation',
    async (orientation, expectedX, expectedY, expectedWidth, expectedHeight) => {
      const rectangle = (left: number, top: number, width: number, height: number): DOMRect => ({
        x: left,
        y: top,
        top,
        right: left + width,
        bottom: top + height,
        left,
        width,
        height,
        toJSON: () => ({}),
      })
      const getBoundingClientRect = vi
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: HTMLElement) {
          if (this.getAttribute('role') === 'radiogroup') return rectangle(20, 30, 240, 140)
          if (this.classList.contains('mk-radio-group__item')) {
            if (this.textContent.startsWith('Starter')) return rectangle(24, 34, 180, 32)
            if (orientation === 'horizontal') return rectangle(108, 34, 72, 32)
            return rectangle(24, 70, 180, 40)
          }
          return rectangle(0, 0, 0, 0)
        })

      try {
        const wrapper = mount(MkRadioGroup, {
          props: {
            items,
            variant: 'segmented',
            orientation,
            modelValue: 'starter',
            'aria-label': 'Plan',
          },
        })
        const options = wrapper.get('[role="radiogroup"]')
        const optionsElement = options.element as HTMLElement
        const flushIndicator = async () => {
          await nextTick()
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
              resolve()
            })
          })
        }

        await flushIndicator()
        await wrapper.setProps({ modelValue: 'team' })
        await flushIndicator()

        expect(options.attributes('data-mk-indicator-ready')).toBe('')
        expect(optionsElement.style.getPropertyValue('--mk-radio-group-indicator-x')).toBe(
          expectedX,
        )
        expect(optionsElement.style.getPropertyValue('--mk-radio-group-indicator-y')).toBe(
          expectedY,
        )
        expect(optionsElement.style.getPropertyValue('--mk-radio-group-indicator-width')).toBe(
          expectedWidth,
        )
        expect(optionsElement.style.getPropertyValue('--mk-radio-group-indicator-height')).toBe(
          expectedHeight,
        )
        expect(optionsElement.children).toHaveLength(items.length)
      } finally {
        getBoundingClientRect.mockRestore()
      }
    },
  )

  it('replaces radio circles with item icons when the icon slot is present', () => {
    const wrapper = mount(MkRadioGroup, {
      props: { items, defaultValue: 'team', 'aria-label': 'Plan' },
      slots: {
        icon: ({ item }) => `<svg data-icon="${String(item.value)}"></svg>`,
      },
    })

    expect(wrapper.find('.mk-radio-group__indicator').exists()).toBe(false)
    expect(wrapper.findAll('.mk-radio-group__icon')).toHaveLength(3)
    expect(wrapper.findAll('[role="radio"]')[0]?.classes()).toEqual(
      expect.arrayContaining(['mk:absolute', 'mk:opacity-0']),
    )
  })

  it('renders per-item component icons without requiring an icon slot', () => {
    const TestIcon = defineComponent({
      name: 'TestIcon',
      setup: () => () => h('svg', { 'data-test-icon': '' }),
    })
    const wrapper = mount(MkRadioGroup, {
      props: {
        items: items.map((item) => ({ ...item, icon: TestIcon })),
        defaultValue: 'team',
        'aria-label': 'Plan',
      },
    })

    expect(wrapper.findAll('[data-test-icon]')).toHaveLength(3)
    expect(wrapper.find('.mk-radio-group__indicator').exists()).toBe(false)
  })

  it('supports item content slots and local slot classes', () => {
    const wrapper = mount(MkRadioGroup, {
      props: {
        items,
        defaultValue: 'team',
        ui: {
          base: 'w-full',
          indicator: 'indicator-class',
          itemLabel: 'item-label-class',
          itemDescription: 'item-description-class',
        },
        'aria-label': 'Plan',
      },
      slots: {
        indicator: ({ checked }) => (checked ? 'Selected' : ''),
        'item-label': ({ item }) => `Choose ${item.label}`,
        'item-description': ({ item }) => `Details: ${item.description ?? 'None'}`,
      },
    })

    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.get('.mk-radio-group__indicator').classes()).toContain('indicator-class')
    expect(wrapper.get('.mk-radio-group__indicator').text()).toBe('Selected')
    expect(wrapper.get('.mk-radio-group__item-label').classes()).toContain('item-label-class')
    expect(wrapper.get('.mk-radio-group__item-label').text()).toContain('Choose Starter')
    expect(wrapper.get('.mk-radio-group__item-description').classes()).toContain(
      'item-description-class',
    )
  })

  it('uses global defaults and slot configuration without hiding built-in classes', () => {
    const wrapper = mount(MkRadioGroup, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              radioGroup: {
                base: 'w-full',
                slots: { control: 'ring-2', itemLabel: 'font-semibold' },
                variants: {
                  size: { lg: 'gap-4' },
                  variant: { card: 'shadow-lg' },
                  orientation: { horizontal: 'justify-between' },
                },
                defaultVariants: {
                  size: 'lg',
                  variant: 'card',
                  orientation: 'horizontal',
                },
              },
            },
          }),
        ],
      },
      props: { items, label: 'Configured' },
    })

    expect(wrapper.attributes('data-mk-size')).toBe('lg')
    expect(wrapper.attributes('data-mk-variant')).toBe('card')
    expect(wrapper.attributes('data-mk-orientation')).toBe('horizontal')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['w-full', 'gap-4', 'shadow-lg', 'justify-between', 'mk:gap-3']),
    )
    expect(wrapper.get('[role="radio"]').classes()).toEqual(
      expect.arrayContaining(['ring-2', 'mk:size-6']),
    )
    expect(wrapper.get('.mk-radio-group__item-label').classes()).toContain('font-semibold')
  })

  it('exports the finite contracts', () => {
    expect(radioGroupSizes).toEqual(['sm', 'md', 'lg'])
    expect(radioGroupVariants).toEqual(['default', 'card', 'table', 'segmented', 'pills'])
    expect(radioGroupOrientations).toEqual(['vertical', 'horizontal'])
  })
})
