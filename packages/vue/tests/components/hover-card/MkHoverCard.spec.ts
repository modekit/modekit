import { mount } from '@vue/test-utils'
import { HoverCardContent, HoverCardRoot } from 'reka-ui'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import {
  createModeKit,
  hoverCardAlignments,
  hoverCardPositionStrategies,
  hoverCardSides,
  MkHoverCard,
} from '../../../src/index.js'
import type { HoverCardProps } from '../../../src/index.js'

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

function mountHoverCard(props: Partial<HoverCardProps> = {}) {
  return mount(MkHoverCard, {
    attachTo: document.body,
    props: {
      portal: false,
      ...props,
    },
    slots: {
      default: () => h('a', { href: '/profile' }, '@modekit'),
      content: ({ open }) => h('p', { 'data-open': String(open) }, 'Profile summary'),
    },
  })
}

afterEach(() => {
  vi.useRealTimers()
  document.body.replaceChildren()
})

describe('MkHoverCard', () => {
  it('opens after the pointer delay and closes after the configured delay', async () => {
    vi.useFakeTimers()
    const wrapper = mountHoverCard({ openDelay: 120, closeDelay: 80 })
    const trigger = wrapper.get('a')

    expect(trigger.attributes('data-state')).toBe('closed')
    expect(wrapper.find('.mk-hover-card').exists()).toBe(false)

    await trigger.trigger('pointerenter', { pointerType: 'mouse' })
    await vi.advanceTimersByTimeAsync(119)
    expect(wrapper.find('.mk-hover-card').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await nextTick()
    expect(wrapper.get('.mk-hover-card').text()).toBe('Profile summary')
    expect(trigger.attributes('data-state')).toBe('open')
    expect(wrapper.emitted('update:open')).toEqual([[true]])

    await trigger.trigger('blur')
    await vi.advanceTimersByTimeAsync(80)
    await nextTick()
    expect(wrapper.find('.mk-hover-card').exists()).toBe(false)
    expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
  })

  it('opens from keyboard focus and exposes state to content', async () => {
    vi.useFakeTimers()
    const wrapper = mountHoverCard({ openDelay: 40 })

    await wrapper.get('a').trigger('focus')
    await vi.advanceTimersByTimeAsync(40)
    await nextTick()

    expect(wrapper.get('.mk-hover-card').attributes('data-open')).toBeUndefined()
    expect(wrapper.get('.mk-hover-card [data-open]').attributes('data-open')).toBe('true')
  })

  it('supports explicit uncontrolled and controlled state', async () => {
    const uncontrolled = mountHoverCard({ defaultOpen: true })
    const controlled = mountHoverCard({ open: true })

    expect(uncontrolled.get('.mk-hover-card').text()).toBe('Profile summary')
    expect(controlled.get('.mk-hover-card').text()).toBe('Profile summary')

    controlled.getComponent(HoverCardRoot).vm.$emit('update:open', false)
    await nextTick()

    expect(controlled.emitted('update:open')).toEqual([[false]])
    expect(controlled.find('.mk-hover-card').exists()).toBe(true)
  })

  it('ignores touch by default and supports opt-in touch toggling', async () => {
    const ignored = mountHoverCard()
    const enabled = mountHoverCard({ enableTouch: true })

    await ignored.get('a').trigger('pointerup', { pointerType: 'touch' })
    await enabled.get('a').trigger('pointerup', { pointerType: 'touch' })
    await nextTick()

    expect(ignored.find('.mk-hover-card').exists()).toBe(false)
    expect(enabled.get('.mk-hover-card').text()).toBe('Profile summary')
    expect(enabled.emitted('update:open')).toEqual([[true]])
  })

  it.each(hoverCardSides)('forwards the %s side to Reka UI', (side) => {
    const wrapper = mountHoverCard({ defaultOpen: true, side })

    expect(wrapper.getComponent(HoverCardContent).props('side')).toBe(side)
    expect(wrapper.get('.mk-hover-card').attributes('data-mk-side')).toBe(side)
  })

  it.each(hoverCardAlignments)('forwards the %s alignment to Reka UI', (align) => {
    const wrapper = mountHoverCard({ defaultOpen: true, align })

    expect(wrapper.getComponent(HoverCardContent).props('align')).toBe(align)
    expect(wrapper.get('.mk-hover-card').attributes('data-mk-align')).toBe(align)
  })

  it('forwards timing, positioning, and collision behavior', () => {
    const collisionPadding = { top: 16, right: 12 }
    const wrapper = mountHoverCard({
      defaultOpen: true,
      openDelay: 500,
      closeDelay: 200,
      enableTouch: true,
      sideOffset: 12,
      alignOffset: -4,
      avoidCollisions: false,
      collisionPadding,
      hideWhenDetached: true,
      positionStrategy: 'absolute',
    })
    const root = wrapper.getComponent(HoverCardRoot)
    const content = wrapper.getComponent(HoverCardContent)

    expect(root.props()).toMatchObject({
      openDelay: 500,
      closeDelay: 200,
      enableTouch: true,
    })
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
    const defaultPortal = mount(MkHoverCard, {
      attachTo: document.body,
      props: { defaultOpen: true },
      slots: {
        default: () => h('a', { href: '#' }, 'Default'),
        content: () => 'Default portal',
      },
    })
    const target = document.createElement('div')
    target.id = 'hover-card-target'
    document.body.append(target)
    const customPortal = mount(MkHoverCard, {
      attachTo: document.body,
      props: { defaultOpen: true, portal: '#hover-card-target' },
      slots: {
        default: () => h('a', { href: '#' }, 'Custom'),
        content: () => 'Custom portal',
      },
    })

    await nextTick()
    await nextTick()

    expect(
      [...document.body.querySelectorAll('.mk-hover-card')].map((element) => element.textContent),
    ).toEqual(expect.arrayContaining(['Default portal', 'Custom portal']))
    expect(target.querySelector('.mk-hover-card')?.textContent).toBe('Custom portal')

    defaultPortal.unmount()
    customPortal.unmount()
  })

  it('renders an optional customizable arrow', () => {
    const wrapper = mount(MkHoverCard, {
      props: { arrow: true, defaultOpen: true, portal: false },
      slots: {
        default: () => h('a', { href: '#' }, 'Profile'),
        content: () => 'Content',
        arrow: () => h('path', { class: 'custom-arrow-path' }),
      },
    })
    const arrow = wrapper.get('.mk-hover-card__arrow')

    expect(arrow.classes()).toEqual(
      expect.arrayContaining([
        'mk-hover-card__arrow',
        'mk:-translate-y-px',
        'mk:fill-white',
        'mk:stroke-neutral-200',
      ]),
    )
    expect(wrapper.find('.custom-arrow-path').exists()).toBe(true)
  })

  it.each(['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside'] as const)(
    'forwards the %s lifecycle event',
    (eventName) => {
      const wrapper = mountHoverCard({ defaultOpen: true })
      const event =
        eventName === 'escapeKeyDown'
          ? new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' })
          : new Event(eventName, { cancelable: true })

      wrapper.getComponent(HoverCardContent).vm.$emit(eventName, event)

      expect(event.defaultPrevented).toBe(false)
      expect(wrapper.emitted(eventName)).toEqual([[event]])
    },
  )

  it('merges global, local, and native content classes in override order', () => {
    const wrapper = mount(MkHoverCard, {
      global: {
        plugins: [
          createModeKit({
            ui: {
              hoverCard: {
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
        default: () => h('a', { href: '#' }, 'Profile'),
        content: () => 'Content',
      },
    })
    const content = wrapper.get('.mk-hover-card')
    const arrow = wrapper.get('.mk-hover-card__arrow')

    expect(content.classes()).toEqual(
      expect.arrayContaining([
        'mk-hover-card',
        'mk:p-8',
        'global-content',
        'local-content',
        'native-content',
      ]),
    )
    expect(content.classes()).not.toEqual(expect.arrayContaining(['mk:p-4', 'mk:p-5', 'mk:p-6']))
    expect(arrow.classes()).toEqual(
      expect.arrayContaining(['global-arrow', 'local-arrow', 'mk-hover-card__arrow']),
    )
  })

  it('exports its finite positioning contracts', () => {
    expect(hoverCardSides).toEqual(['top', 'right', 'bottom', 'left'])
    expect(hoverCardAlignments).toEqual(['start', 'center', 'end'])
    expect(hoverCardPositionStrategies).toEqual(['absolute', 'fixed'])
  })
})
