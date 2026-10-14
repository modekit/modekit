import { mount } from '@vue/test-utils'
import { PopoverContent, PopoverRoot } from 'reka-ui'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import {
  createModeKit,
  MkPopover,
  popoverAlignments,
  popoverPositionStrategies,
  popoverSides,
} from '../../../src/index.js'
import type { PopoverProps } from '../../../src/index.js'

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

function mountPopover(props: Partial<PopoverProps> = {}) {
  return mount(MkPopover, {
    attachTo: document.body,
    props: {
      portal: false,
      ...props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'Open'),
      content: () => h('p', 'Popover content'),
    },
  })
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('MkPopover', () => {
  it('opens from a semantic trigger and renders dialog content', async () => {
    const wrapper = mountPopover()
    const trigger = wrapper.get('button')

    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await trigger.trigger('click')
    await nextTick()

    const content = wrapper.get('[role="dialog"]')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(content.attributes('id'))
    expect(content.text()).toBe('Popover content')
    expect(content.attributes('data-mk-side')).toBe('bottom')
    expect(content.attributes('data-mk-align')).toBe('center')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const wrapper = mount(MkPopover, {
      attachTo: document.body,
      props: { portal: false },
      slots: {
        default: () => h('button', { type: 'button' }, 'Open'),
        content: () => h('button', { type: 'button' }, 'Focusable content'),
      },
    })
    const trigger = wrapper.get('button')

    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('click')
    await nextTick()
    await nextTick()

    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await nextTick()
    await nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
  })

  it('supports explicit uncontrolled and controlled state', async () => {
    const uncontrolled = mountPopover({ defaultOpen: true })
    const controlled = mountPopover({ open: true })

    expect(uncontrolled.get('[role="dialog"]').text()).toBe('Popover content')
    expect(controlled.get('[role="dialog"]').text()).toBe('Popover content')

    await controlled.get('button').trigger('click')
    await nextTick()

    expect(controlled.emitted('update:open')).toEqual([[false]])
    expect(controlled.find('[role="dialog"]').exists()).toBe(true)
  })

  it('gives content a close action through slot props', async () => {
    const wrapper = mount(MkPopover, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', { type: 'button' }, 'Open'),
        content: ({ open, close }) =>
          h('button', { type: 'button', 'data-open': String(open), onClick: close }, 'Done'),
      },
    })
    const closeButton = wrapper.get('[role="dialog"] button')

    expect(closeButton.attributes('data-open')).toBe('true')

    await closeButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it.each(popoverSides)('forwards the %s side to Reka UI', (side) => {
    const wrapper = mountPopover({ defaultOpen: true, side })

    expect(wrapper.getComponent(PopoverContent).props('side')).toBe(side)
    expect(wrapper.get('[role="dialog"]').attributes('data-mk-side')).toBe(side)
  })

  it.each(popoverAlignments)('forwards the %s alignment to Reka UI', (align) => {
    const wrapper = mountPopover({ defaultOpen: true, align })

    expect(wrapper.getComponent(PopoverContent).props('align')).toBe(align)
    expect(wrapper.get('[role="dialog"]').attributes('data-mk-align')).toBe(align)
  })

  it('forwards positioning, collision, and modal behavior', () => {
    const collisionPadding = { top: 16, right: 12 }
    const wrapper = mountPopover({
      defaultOpen: true,
      modal: true,
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
    })
    const content = wrapper.getComponent(PopoverContent)

    expect(wrapper.getComponent(PopoverRoot).props('modal')).toBe(true)
    expect(content.props()).toMatchObject({
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
    })
  })

  it('portals to the body by default and supports a custom target', async () => {
    const defaultPortal = mount(MkPopover, {
      attachTo: document.body,
      props: { defaultOpen: true },
      slots: {
        default: () => h('button', 'Open default'),
        content: () => 'Default portal',
      },
    })
    const target = document.createElement('div')
    target.id = 'popover-target'
    document.body.append(target)
    const customPortal = mount(MkPopover, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: '#popover-target' },
      slots: {
        default: () => h('button', 'Open custom'),
        content: () => 'Custom portal',
      },
    })

    await nextTick()
    await nextTick()

    expect(
      [...document.body.querySelectorAll('.mk-popover')].map((element) => element.textContent),
    ).toEqual(expect.arrayContaining(['Default portal', 'Custom portal']))
    expect(target.querySelector('.mk-popover')?.textContent).toBe('Custom portal')

    defaultPortal.unmount()
    customPortal.unmount()
  })

  it('renders an optional customizable arrow', () => {
    const wrapper = mount(MkPopover, {
      props: { arrow: true, defaultOpen: true, portal: false },
      slots: {
        default: () => h('button', 'Open'),
        content: () => 'Content',
        arrow: () => h('path', { class: 'custom-arrow-path' }),
      },
    })
    const arrow = wrapper.get('.mk-popover__arrow')

    expect(arrow.classes()).toEqual(
      expect.arrayContaining(['mk-popover__arrow', 'mk:fill-white', 'mk:stroke-neutral-200']),
    )
    expect(wrapper.find('.custom-arrow-path').exists()).toBe(true)
  })

  it('keeps an uncontrolled popover open on Escape when dismissal is disabled', async () => {
    const wrapper = mountPopover({ defaultOpen: true, dismissible: false })

    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await nextTick()
    await nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it.each(['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside'] as const)(
    'prevents %s dismissal when dismissible is false',
    (eventName) => {
      const wrapper = mountPopover({ defaultOpen: true, dismissible: false })
      const event =
        eventName === 'escapeKeyDown'
          ? new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' })
          : new Event(eventName, { cancelable: true })

      wrapper.getComponent(PopoverContent).vm.$emit(eventName, event)

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted(eventName)).toEqual([[event]])
    },
  )

  it('forwards focus lifecycle events without preventing them', () => {
    const wrapper = mountPopover({ defaultOpen: true })
    const openEvent = new Event('openAutoFocus', { cancelable: true })
    const closeEvent = new Event('closeAutoFocus', { cancelable: true })
    const content = wrapper.getComponent(PopoverContent)

    content.vm.$emit('openAutoFocus', openEvent)
    content.vm.$emit('closeAutoFocus', closeEvent)

    expect(openEvent.defaultPrevented).toBe(false)
    expect(closeEvent.defaultPrevented).toBe(false)
    expect(wrapper.emitted('openAutoFocus')).toEqual([[openEvent]])
    expect(wrapper.emitted('closeAutoFocus')).toEqual([[closeEvent]])
  })

  it('merges global, local, and native content classes in override order', () => {
    const wrapper = mount(MkPopover, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              popover: {
                base: 'mk:p-5 global-content',
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
        ui: { base: 'mk:p-6 local-content', arrow: 'local-arrow' },
        class: 'mk:p-8 native-content',
      },
      slots: {
        default: () => h('button', 'Open'),
        content: () => 'Content',
      },
    })
    const content = wrapper.get('[role="dialog"]')
    const arrow = wrapper.get('.mk-popover__arrow')

    expect(content.classes()).toEqual(
      expect.arrayContaining([
        'mk-popover',
        'mk:p-8',
        'global-content',
        'local-content',
        'native-content',
      ]),
    )
    expect(content.classes()).not.toEqual(expect.arrayContaining(['mk:p-4', 'mk:p-5', 'mk:p-6']))
    expect(arrow.classes()).toEqual(
      expect.arrayContaining(['global-arrow', 'local-arrow', 'mk-popover__arrow']),
    )
  })

  it('exports its finite positioning contracts', () => {
    expect(popoverSides).toEqual(['top', 'right', 'bottom', 'left'])
    expect(popoverAlignments).toEqual(['start', 'center', 'end'])
    expect(popoverPositionStrategies).toEqual(['absolute', 'fixed'])
  })
})
