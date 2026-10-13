import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import {
  createModeKit,
  MkTabs,
  tabsActivationModes,
  tabsSizes,
  tabsVariants,
} from '../../../src/index.js'
import type { TabsItem } from '../../../src/index.js'

const items: readonly TabsItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings', disabled: true },
]

describe('MkTabs', () => {
  it('selects the first enabled item and connects it to its panel', async () => {
    const wrapper = mount(MkTabs, {
      props: { items },
      slots: {
        content: ({ item }) => `Content for ${item.label}`,
      },
    })
    const tabs = wrapper.findAll('[role="tab"]')
    const panel = wrapper.get('[role="tabpanel"]')

    await nextTick()

    expect(wrapper.attributes('data-mk-variant')).toBe('line')
    expect(wrapper.attributes('data-mk-size')).toBe('md')
    expect(wrapper.get('[role="tablist"]').attributes('aria-orientation')).toBe('horizontal')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]?.attributes('aria-selected')).toBe('true')
    expect(tabs[0]?.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tabs[0]?.attributes('id'))
    expect(panel.text()).toBe('Content for Overview')
    expect(panel.classes()).toContain('mk-tabs__content')
  })

  it('updates uncontrolled selection through Reka UI behavior', async () => {
    const wrapper = mount(MkTabs, {
      props: { items },
      slots: { content: ({ item }) => item.label },
    })
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[1]?.trigger('mousedown', { button: 0, ctrlKey: false })

    expect(wrapper.emitted('update:modelValue')).toEqual([['activity']])
    expect(tabs[1]?.attributes('aria-selected')).toBe('true')
    const activePanel = wrapper
      .findAll('[role="tabpanel"]')
      .find((panel) => panel.attributes('data-state') === 'active')

    expect(activePanel?.text()).toBe('Activity')
  })

  it('supports automatic focus activation', async () => {
    const wrapper = mount(MkTabs, {
      props: { items },
      attachTo: document.body,
    })
    const tabs = wrapper.findAll('[role="tab"]')

    ;(tabs[1]?.element as HTMLElement).focus()
    await tabs[1]?.trigger('focus')
    await nextTick()

    expect(document.activeElement).toBe(tabs[1]?.element)
    expect(tabs[1]?.attributes('aria-selected')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toEqual([['activity']])

    wrapper.unmount()
  })

  it('requires explicit selection in manual activation mode', async () => {
    const wrapper = mount(MkTabs, {
      props: { items, activationMode: 'manual' },
      attachTo: document.body,
    })
    const tabs = wrapper.findAll('[role="tab"]')

    ;(tabs[1]?.element as HTMLElement).focus()
    await tabs[1]?.trigger('focus')
    await nextTick()

    expect(document.activeElement).toBe(tabs[1]?.element)
    expect(tabs[0]?.attributes('aria-selected')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await tabs[1]?.trigger('keydown', { key: 'Enter' })

    expect(tabs[1]?.attributes('aria-selected')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toEqual([['activity']])

    wrapper.unmount()
  })

  it('supports controlled values and numeric item values', () => {
    const numericItems: readonly TabsItem[] = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ]
    const wrapper = mount(MkTabs, {
      props: { items: numericItems, modelValue: 2 },
    })

    expect(wrapper.findAll('[role="tab"]')[1]?.attributes('aria-selected')).toBe('true')
  })

  it('respects an explicit uncontrolled default', () => {
    const wrapper = mount(MkTabs, {
      props: { items, defaultValue: 'activity' },
    })

    expect(wrapper.findAll('[role="tab"]')[1]?.attributes('aria-selected')).toBe('true')
  })

  it('prevents selecting a disabled item', async () => {
    const wrapper = mount(MkTabs, { props: { items } })
    const disabledTab = wrapper.findAll('[role="tab"]')[2]

    await disabledTab?.trigger('mousedown', { button: 0, ctrlKey: false })

    expect(disabledTab?.attributes('disabled')).toBeDefined()
    expect(disabledTab?.attributes('data-disabled')).toBe('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it.each([
    ['sm', 'mk:h-8', 'mk:rounded-md'],
    ['md', 'mk:h-10', 'mk:rounded-lg'],
    ['lg', 'mk:h-12', 'mk:rounded-xl'],
  ] as const)('resolves the %s size coherently', (size, height, radius) => {
    const wrapper = mount(MkTabs, { props: { items, size } })
    const tab = wrapper.get('[role="tab"]')

    expect(wrapper.attributes('data-mk-size')).toBe(size)
    expect(tab.classes()).toEqual(expect.arrayContaining([height, radius]))
  })

  it('renders the pill presentation with semantic surface roles', () => {
    const wrapper = mount(MkTabs, { props: { items, variant: 'pill' } })

    expect(wrapper.attributes('data-mk-variant')).toBe('pill')
    expect(wrapper.get('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining(['mk:bg-muted', 'mk:rounded-xl', 'mk:p-1']),
    )
    expect(wrapper.get('[role="tab"]').classes()).toEqual(
      expect.arrayContaining([
        'mk:data-[state=active]:bg-surface',
        'mk:data-[state=active]:text-surface-foreground',
      ]),
    )
  })

  it('supports typed presentation slots for each item', () => {
    const wrapper = mount(MkTabs, {
      props: { items },
      slots: {
        leading: ({ item }) => `Before ${item.label}`,
        tab: ({ item, active }) => `${item.label} ${active ? 'active' : 'idle'}`,
        trailing: ({ item }) => `After ${item.label}`,
        content: ({ item, active }) => `${item.label} panel ${active ? 'active' : 'idle'}`,
      },
    })
    const firstTab = wrapper.get('[role="tab"]')

    expect(firstTab.get('.mk-tabs__leading').text()).toBe('Before Overview')
    expect(firstTab.get('.mk-tabs__label').text()).toBe('Overview active')
    expect(firstTab.get('.mk-tabs__trailing').text()).toBe('After Overview')
    expect(wrapper.get('[role="tabpanel"]').text()).toBe('Overview panel active')
  })

  it('uses global defaults and local slot classes without hiding built-in classes', () => {
    const wrapper = mount(MkTabs, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              tabs: {
                base: 'w-full',
                slots: {
                  list: 'justify-center',
                  trigger: 'font-semibold',
                },
                variants: {
                  size: { lg: 'gap-5' },
                  variant: { pill: 'custom-pill' },
                },
                defaultVariants: {
                  size: 'lg',
                  variant: 'pill',
                },
              },
            },
          }),
        ],
      },
      props: {
        items,
        class: 'local-root',
        ui: { trigger: 'local-trigger' },
      },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['mk-tabs', 'w-full', 'gap-5', 'custom-pill', 'local-root']),
    )
    expect(wrapper.get('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining(['mk-tabs__list', 'justify-center']),
    )
    expect(wrapper.get('[role="tab"]').classes()).toEqual(
      expect.arrayContaining(['mk:h-12', 'font-semibold', 'local-trigger']),
    )
  })

  it('exports its finite contracts', () => {
    expect(tabsVariants).toEqual(['line', 'pill'])
    expect(tabsSizes).toEqual(['sm', 'md', 'lg'])
    expect(tabsActivationModes).toEqual(['automatic', 'manual'])
  })
})
