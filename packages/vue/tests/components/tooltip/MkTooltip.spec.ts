import { mount } from '@vue/test-utils'
import { TooltipContent, TooltipProvider, TooltipRoot } from 'reka-ui'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import {
  createModeKit,
  MkTooltip,
  MkTooltipProvider,
  tooltipAlignments,
  tooltipPositionStrategies,
  tooltipSides,
} from '../../../src/index.js'
import type { TooltipProps } from '../../../src/index.js'

class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

function mountTooltip(props: Partial<TooltipProps> = {}) {
  return mount(MkTooltip, {
    attachTo: document.body,
    props: {
      portal: false,
      ...props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'More information'),
      content: () => 'Helpful context',
    },
  })
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('MkTooltip', () => {
  it('describes a semantic trigger and renders tooltip content', () => {
    const wrapper = mountTooltip({ defaultOpen: true })
    const trigger = wrapper.get('button')
    const content = wrapper.get('.mk-tooltip')
    const accessibleContent = wrapper.get('[role="tooltip"]')

    expect(trigger.attributes('aria-describedby')).toBe(accessibleContent.attributes('id'))
    expect(trigger.attributes('data-state')).toBe('instant-open')
    expect(content.text()).toContain('Helpful context')
    expect(content.attributes('data-mk-side')).toBe('top')
    expect(content.attributes('data-mk-align')).toBe('center')
  })

  it('supports explicit uncontrolled and controlled state', async () => {
    const uncontrolled = mountTooltip({ defaultOpen: true })
    const controlled = mountTooltip({ open: true })

    expect(uncontrolled.find('.mk-tooltip').exists()).toBe(true)
    expect(controlled.find('.mk-tooltip').exists()).toBe(true)

    controlled.getComponent(TooltipRoot).vm.$emit('update:open', false)
    await nextTick()

    expect(controlled.emitted('update:open')).toEqual([[false]])
    expect(controlled.find('.mk-tooltip').exists()).toBe(true)
  })

  it('provides open state to the content slot', () => {
    const wrapper = mount(MkTooltip, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Open'),
        content: ({ open }) => h('span', { 'data-open': String(open) }, 'Content'),
      },
    })

    expect(wrapper.get('.mk-tooltip [data-open]').attributes('data-open')).toBe('true')
  })

  it('creates a default provider when used standalone', () => {
    const wrapper = mountTooltip()

    expect(wrapper.findComponent(TooltipProvider).exists()).toBe(true)
    expect(wrapper.getComponent(TooltipProvider).props()).toMatchObject({
      delayDuration: 700,
      skipDelayDuration: 300,
      disableHoverableContent: false,
      disableClosingTrigger: false,
      disabled: false,
      ignoreNonKeyboardFocus: false,
    })
  })

  it('inherits shared provider behavior without nesting another provider', () => {
    const wrapper = mount(MkTooltipProvider, {
      props: {
        delayDuration: 120,
        skipDelayDuration: 500,
        disableHoverableContent: true,
        disableClosingTrigger: true,
        ignoreNonKeyboardFocus: true,
      },
      slots: {
        default: () =>
          h(
            MkTooltip,
            { portal: false },
            {
              default: () => h('button', 'Open'),
              content: () => 'Content',
            },
          ),
      },
    })

    expect(wrapper.findAllComponents(TooltipProvider)).toHaveLength(1)
    expect(wrapper.getComponent(TooltipProvider).props()).toMatchObject({
      delayDuration: 120,
      skipDelayDuration: 500,
      disableHoverableContent: true,
      disableClosingTrigger: true,
      ignoreNonKeyboardFocus: true,
    })
    expect(wrapper.getComponent(TooltipRoot).props('delayDuration')).toBeUndefined()
  })

  it('forwards local timing and interaction overrides to the root', () => {
    const wrapper = mountTooltip({
      delayDuration: 80,
      disableHoverableContent: true,
      disableClosingTrigger: true,
      disabled: true,
      ignoreNonKeyboardFocus: true,
    })

    expect(wrapper.getComponent(TooltipRoot).props()).toMatchObject({
      delayDuration: 80,
      disableHoverableContent: true,
      disableClosingTrigger: true,
      disabled: true,
      ignoreNonKeyboardFocus: true,
    })
  })

  it.each(tooltipSides)('forwards the %s side to Reka UI', (side) => {
    const wrapper = mountTooltip({ defaultOpen: true, side })

    expect(wrapper.getComponent(TooltipContent).props('side')).toBe(side)
    expect(wrapper.get('.mk-tooltip').attributes('data-mk-side')).toBe(side)
  })

  it.each(tooltipAlignments)('forwards the %s alignment to Reka UI', (align) => {
    const wrapper = mountTooltip({ defaultOpen: true, align })

    expect(wrapper.getComponent(TooltipContent).props('align')).toBe(align)
    expect(wrapper.get('.mk-tooltip').attributes('data-mk-align')).toBe(align)
  })

  it('forwards positioning and collision behavior', () => {
    const collisionPadding = { top: 16, right: 12 }
    const wrapper = mountTooltip({
      defaultOpen: true,
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
    })

    expect(wrapper.getComponent(TooltipContent).props()).toMatchObject({
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
    })
  })

  it('portals to the body by default and supports a custom target', async () => {
    const defaultPortal = mount(MkTooltip, {
      attachTo: document.body,
      props: { defaultOpen: true },
      slots: {
        default: () => h('button', 'Open default'),
        content: () => 'Default portal',
      },
    })
    const target = document.createElement('div')
    target.id = 'tooltip-target'
    document.body.append(target)
    const customPortal = mount(MkTooltip, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: '#tooltip-target' },
      slots: {
        default: () => h('button', 'Open custom'),
        content: () => 'Custom portal',
      },
    })

    await nextTick()
    await nextTick()

    expect(
      [...document.body.querySelectorAll('.mk-tooltip')].map((element) => element.textContent),
    ).toEqual(
      expect.arrayContaining(['Default portalDefault portal', 'Custom portalCustom portal']),
    )
    expect(target.querySelector('.mk-tooltip')?.textContent).toBe('Custom portalCustom portal')

    defaultPortal.unmount()
    customPortal.unmount()
  })

  it('renders an optional customizable arrow with a surface overlap', () => {
    const wrapper = mount(MkTooltip, {
      props: { arrow: true, defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Open'),
        content: () => 'Content',
        arrow: () => h('path', { class: 'custom-arrow-path' }),
      },
    })
    const arrow = wrapper.get('.mk-tooltip__arrow')

    expect(arrow.classes()).toEqual(
      expect.arrayContaining(['mk-tooltip__arrow', 'mk:-translate-y-px', 'mk:fill-neutral-950']),
    )
    expect(wrapper.find('.custom-arrow-path').exists()).toBe(true)
  })

  it('forwards Escape and outside-pointer lifecycle events', () => {
    const wrapper = mountTooltip({ defaultOpen: true })
    const escapeEvent = new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' })
    const pointerEvent = new Event('pointerDownOutside', { cancelable: true })
    const content = wrapper.getComponent(TooltipContent)

    content.vm.$emit('escapeKeyDown', escapeEvent)
    content.vm.$emit('pointerDownOutside', pointerEvent)

    expect(wrapper.emitted('escapeKeyDown')).toEqual([[escapeEvent]])
    expect(wrapper.emitted('pointerDownOutside')).toEqual([[pointerEvent]])
  })

  it('merges global, local, and native content classes in override order', () => {
    const wrapper = mount(MkTooltip, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              tooltip: {
                base: 'mk:px-3 global-content',
                slots: { arrow: 'global-arrow' },
              },
            },
          }),
        ],
      },
      props: {
        arrow: true,
        defaultOpen: true,
        portal: false,
        ui: { base: 'mk:px-4 local-content', arrow: 'local-arrow' },
        class: 'mk:px-5 native-content',
      },
      slots: {
        default: () => h('button', 'Open'),
        content: () => 'Content',
      },
    })
    const content = wrapper.get('.mk-tooltip')
    const arrow = wrapper.get('.mk-tooltip__arrow')

    expect(content.classes()).toEqual(
      expect.arrayContaining([
        'mk-tooltip',
        'mk:px-5',
        'global-content',
        'local-content',
        'native-content',
      ]),
    )
    expect(content.classes()).not.toEqual(
      expect.arrayContaining(['mk:px-2.5', 'mk:px-3', 'mk:px-4']),
    )
    expect(arrow.classes()).toEqual(
      expect.arrayContaining(['global-arrow', 'local-arrow', 'mk-tooltip__arrow']),
    )
  })

  it('exports its finite positioning contracts', () => {
    expect(tooltipSides).toEqual(['top', 'right', 'bottom', 'left'])
    expect(tooltipAlignments).toEqual(['start', 'center', 'end'])
    expect(tooltipPositionStrategies).toEqual(['absolute', 'fixed'])
  })
})
