import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
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
    ['sm', 'mk:h-8', 'mk:rounded-md', 'mk:after:rounded-md'],
    ['md', 'mk:h-10', 'mk:rounded-lg', 'mk:after:rounded-lg'],
    ['lg', 'mk:h-12', 'mk:rounded-xl', 'mk:after:rounded-xl'],
  ] as const)(
    'resolves the %s segmented size coherently',
    (size, height, radius, indicatorRadius) => {
      const wrapper = mount(MkTabs, { props: { items, size, variant: 'segmented' } })
      const tab = wrapper.get('[role="tab"]')

      expect(wrapper.attributes('data-mk-size')).toBe(size)
      expect(tab.classes()).toEqual(expect.arrayContaining([height, radius]))
      expect(wrapper.get('[role="tablist"]').classes()).toContain(indicatorRadius)
    },
  )

  it('keeps line triggers square and preserves their hover treatment', () => {
    const tab = mount(MkTabs, { props: { items, variant: 'line' } }).get('[role="tab"]')

    expect(tab.classes()).toContain('mk:rounded-none')
    expect(tab.classes()).toContain('mk:hover:text-foreground')
    expect(tab.classes()).not.toContain('mk:hover:bg-muted/50')
    expect(tab.classes()).not.toContain('mk:rounded-lg')
  })

  it('moves the active indicator between variable-width triggers without adding markup', async () => {
    const rectangle = (left: number, width: number): DOMRect => ({
      x: left,
      y: 0,
      top: 0,
      right: left + width,
      bottom: 40,
      left,
      width,
      height: 40,
      toJSON: () => ({}),
    })
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.getAttribute('role') === 'tablist') return rectangle(20, 240)
        if (this.textContent === 'Overview') return rectangle(20, 72)
        if (this.textContent === 'Activity') return rectangle(92, 68)
        return rectangle(160, 76)
      })

    try {
      const wrapper = mount(MkTabs, { props: { items, modelValue: 'overview' } })
      const list = wrapper.get('[role="tablist"]')
      const listElement = list.element as HTMLElement
      const flushIndicator = async () => {
        await nextTick()
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => {
            resolve()
          }),
        )
      }

      await flushIndicator()

      expect(list.attributes('data-mk-indicator-ready')).toBe('')
      expect(listElement.style.getPropertyValue('--mk-tabs-indicator-x')).toBe('0px')
      expect(listElement.style.getPropertyValue('--mk-tabs-indicator-width')).toBe('72px')
      expect(listElement.children).toHaveLength(items.length)

      await wrapper.setProps({ modelValue: 'activity' })
      await flushIndicator()

      expect(listElement.style.getPropertyValue('--mk-tabs-indicator-x')).toBe('72px')
      expect(listElement.style.getPropertyValue('--mk-tabs-indicator-width')).toBe('68px')
      expect(listElement.children).toHaveLength(items.length)
    } finally {
      getBoundingClientRect.mockRestore()
    }
  })

  it('renders the segmented presentation with a moving surface indicator', () => {
    const wrapper = mount(MkTabs, { props: { items, variant: 'segmented' } })

    expect(wrapper.attributes('data-mk-variant')).toBe('segmented')
    expect(wrapper.get('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining([
        'mk:bg-muted',
        'mk:rounded-xl',
        'mk:p-1',
        'mk:after:bg-surface',
        'mk:after:shadow-raised',
      ]),
    )
    const triggerClasses = wrapper.get('[role="tab"]').classes()

    expect(triggerClasses).toEqual(
      expect.arrayContaining([
        'mk:data-[state=active]:bg-surface',
        'mk:data-[state=active]:text-surface-foreground',
        'mk:data-[state=active]:shadow-raised',
      ]),
    )
    expect(triggerClasses.some((className) => className.includes('hover:'))).toBe(false)
  })

  it('renders pill tabs as independent rounded badges without an indicator', async () => {
    const wrapper = mount(MkTabs, { props: { items, variant: 'pill' } })
    const listClasses = wrapper.get('[role="tablist"]').classes()
    const triggerClasses = wrapper.get('[role="tab"]').classes()

    expect(wrapper.attributes('data-mk-variant')).toBe('pill')
    expect(listClasses).toEqual(expect.arrayContaining(['mk:w-fit', 'mk:gap-2']))
    expect(listClasses.some((className) => className.includes('after:'))).toBe(false)
    await nextTick()
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => {
        resolve()
      }),
    )
    expect(wrapper.get('[role="tablist"]').attributes('data-mk-indicator-ready')).toBeUndefined()
    expect(
      (wrapper.get('[role="tablist"]').element as HTMLElement).style.getPropertyValue(
        '--mk-tabs-indicator-width',
      ),
    ).toBe('')
    expect(triggerClasses).toEqual(
      expect.arrayContaining([
        'mk:rounded-full',
        'mk:bg-muted',
        'mk:data-[state=active]:bg-primary',
        'mk:data-[state=active]:text-primary-foreground',
      ]),
    )
    expect(triggerClasses.some((className) => className.includes('hover:'))).toBe(false)
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
                  variant: { segmented: 'custom-segmented' },
                },
                defaultVariants: {
                  size: 'lg',
                  variant: 'segmented',
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
      expect.arrayContaining(['mk-tabs', 'w-full', 'gap-5', 'custom-segmented', 'local-root']),
    )
    expect(wrapper.get('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining(['mk-tabs__list', 'justify-center']),
    )
    expect(wrapper.get('[role="tab"]').classes()).toEqual(
      expect.arrayContaining(['mk:h-12', 'font-semibold', 'local-trigger']),
    )
  })

  it('exports its finite contracts', () => {
    expect(tabsVariants).toEqual(['line', 'segmented', 'pill'])
    expect(tabsSizes).toEqual(['sm', 'md', 'lg'])
    expect(tabsActivationModes).toEqual(['automatic', 'manual'])
  })
})
