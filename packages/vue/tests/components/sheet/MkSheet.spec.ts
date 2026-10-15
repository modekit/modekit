import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { DrawerContent, DrawerRoot } from 'reka-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import {
  createModeKit,
  MkSheet,
  sheetSides,
  sheetSizes,
  sheetVariants,
} from '../../../src/index.js'
import type { SheetProps } from '../../../src/index.js'

function mountSheet(props: Partial<SheetProps> = {}): VueWrapper {
  return mount(MkSheet, {
    attachTo: document.body,
    props: {
      portal: false,
      title: 'Edit project',
      description: 'Update the project details.',
      ...props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'Open sheet'),
      content: () => h('input', { 'aria-label': 'Project name' }),
      footer: ({ close }) => h('button', { type: 'button', onClick: close }, 'Save'),
    },
  })
}

async function settle(): Promise<void> {
  await nextTick()
  await nextTick()
}

afterEach(async () => {
  await settle()
  document.body.replaceChildren()
  document.body.removeAttribute('style')
})

describe('MkSheet', () => {
  it('opens from a semantic trigger with labelled modal content', async () => {
    const wrapper = mountSheet()
    const trigger = wrapper.get('button')

    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await trigger.trigger('click')
    await settle()

    const sheet = wrapper.get('[role="dialog"]')
    const title = wrapper.get('.mk-sheet__title')
    const description = wrapper.get('.mk-sheet__description')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(sheet.attributes('id'))
    expect(sheet.attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(sheet.attributes('aria-describedby')).toBe(description.attributes('id'))
    expect(sheet.attributes('data-mk-side')).toBe('right')
    expect(sheet.attributes('data-swipe-direction')).toBe('right')
    expect(wrapper.get('.mk-sheet__overlay').attributes('data-state')).toBe('open')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('supports explicit uncontrolled and controlled state', async () => {
    const uncontrolled = mountSheet({ defaultOpen: true })
    const controlled = mountSheet({ open: true })

    expect(uncontrolled.find('[role="dialog"]').exists()).toBe(true)
    expect(controlled.find('[role="dialog"]').exists()).toBe(true)

    await controlled.get('[aria-label="Close sheet"]').trigger('click')
    await settle()

    expect(controlled.emitted('update:open')).toEqual([[false]])
    expect(controlled.find('[role="dialog"]').exists()).toBe(true)
  })

  it('gives body and footer slots state and a close action', async () => {
    const wrapper = mount(MkSheet, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Slot actions',
      },
      slots: {
        content: ({ open, close }) =>
          h('button', { 'data-open': String(open), onClick: close }, 'Close from body'),
        footer: ({ open }) => h('span', { 'data-footer-open': String(open) }, 'Footer'),
      },
    })

    expect(wrapper.get('.mk-sheet__body button').attributes('data-open')).toBe('true')
    expect(wrapper.get('.mk-sheet__footer span').attributes('data-footer-open')).toBe('true')

    await wrapper.get('.mk-sheet__body button').trigger('click')
    await settle()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it.each([
    ['top', 'up', 'mk:top-0'],
    ['right', 'right', 'mk:right-0'],
    ['bottom', 'down', 'mk:bottom-0'],
    ['left', 'left', 'mk:left-0'],
  ] as const)('maps the %s side to %s swipe dismissal', (side, direction, placementClass) => {
    const wrapper = mountSheet({ defaultOpen: true, side })
    const sheet = wrapper.get('[role="dialog"]')

    expect(sheet.attributes('data-mk-side')).toBe(side)
    expect(sheet.attributes('data-swipe-direction')).toBe(direction)
    expect(sheet.classes()).toContain(placementClass)
    expect(sheet.classes().some((className) => className.includes(`mk-sheet-${side}-open`))).toBe(
      true,
    )
  })

  it.each([
    ['top', 'mk:inset-x-4', 'mk:top-4'],
    ['right', 'mk:inset-y-4', 'mk:right-4'],
    ['bottom', 'mk:inset-x-4', 'mk:bottom-4'],
    ['left', 'mk:inset-y-4', 'mk:left-4'],
  ] as const)('renders the inset variant from the %s edge', (side, axisClass, edgeClass) => {
    const wrapper = mountSheet({ defaultOpen: true, side, variant: 'inset' })
    const sheet = wrapper.get('[role="dialog"]')

    expect(sheet.attributes('data-mk-variant')).toBe('inset')
    expect(sheet.classes()).toEqual(
      expect.arrayContaining([axisClass, edgeClass, 'mk:rounded-xl', 'mk:border']),
    )
    expect(sheet.classes()).not.toContain(
      side === 'top' || side === 'bottom' ? 'mk:inset-x-0' : 'mk:inset-y-0',
    )
  })

  it.each(sheetSizes)('renders the %s horizontal size contract', (size) => {
    const wrapper = mountSheet({ defaultOpen: true, side: 'right', size })
    const sheet = wrapper.get('[role="dialog"]')

    expect(sheet.attributes('data-mk-size')).toBe(size)
    expect(sheet.classes()).toContain(
      {
        sm: 'mk:w-80',
        md: 'mk:w-96',
        lg: 'mk:w-lg',
        xl: 'mk:w-2xl',
      }[size],
    )
  })

  it.each(sheetSizes)('renders the %s vertical size contract', (size) => {
    const wrapper = mountSheet({ defaultOpen: true, side: 'bottom', size })

    expect(wrapper.get('[role="dialog"]').classes()).toContain(
      {
        sm: 'mk:max-h-[40dvh]',
        md: 'mk:max-h-[60dvh]',
        lg: 'mk:max-h-[75dvh]',
        xl: 'mk:max-h-[90dvh]',
      }[size],
    )
  })

  it('renders an optional direction-aware handle', () => {
    const withHandle = mountSheet({ defaultOpen: true, handle: true, side: 'left' })
    const withoutHandle = mountSheet({ defaultOpen: true })

    expect(withHandle.get('.mk-sheet__handle').attributes('data-side')).toBe('left')
    expect(withHandle.get('.mk-sheet__handle').attributes('aria-hidden')).toBe('true')
    expect(withoutHandle.find('.mk-sheet__handle').exists()).toBe(false)
  })

  it('renders composable header actions inside the structural container', () => {
    const wrapper = mount(MkSheet, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Project details',
        description: 'Manage this project.',
      },
      slots: {
        actions: ({ open, close }) =>
          h('button', { 'data-open': String(open), onClick: close }, 'Archive'),
        content: () => 'Body',
      },
    })

    expect(wrapper.get('.mk-sheet__container').classes()).toContain('mk-sheet__container')
    expect(wrapper.get('.mk-sheet__wrapper .mk-sheet__title').text()).toBe('Project details')
    expect(wrapper.get('.mk-sheet__wrapper .mk-sheet__description').text()).toBe(
      'Manage this project.',
    )
    expect(wrapper.get('.mk-sheet__actions button').attributes('data-open')).toBe('true')
  })

  it('emits transition completion events from the primitive lifecycle', () => {
    const wrapper = mountSheet({ defaultOpen: true })
    const root = wrapper.getComponent(DrawerRoot)

    root.vm.$emit('update:openComplete', true)
    root.vm.$emit('update:openComplete', false)

    expect(wrapper.emitted('afterOpen')).toEqual([[]])
    expect(wrapper.emitted('afterClose')).toEqual([[]])
  })

  it('blocks passive dismissal but keeps explicit close actions available', () => {
    const wrapper = mountSheet({ defaultOpen: true, dismissible: false })
    const root = wrapper.getComponent(DrawerRoot)
    const blocked = { reason: 'swipe', cancel: vi.fn(), isCanceled: false }
    const explicit = { reason: 'close-press', cancel: vi.fn(), isCanceled: false }

    root.vm.$emit('update:open', false, blocked)

    expect(blocked.cancel).toHaveBeenCalledOnce()
    expect(wrapper.emitted('closePrevented')).toEqual([['swipe']])
    expect(wrapper.emitted('update:open')).toBeUndefined()

    root.vm.$emit('update:open', false, explicit)

    expect(explicit.cancel).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('forwards modal, focus, and persistent-mount behavior', () => {
    const initialFocus = document.createElement('button')
    const finalFocus = document.createElement('button')
    const wrapper = mountSheet({
      defaultOpen: true,
      initialFocus,
      finalFocus,
      modal: false,
      unmountOnHide: false,
    })
    const root = wrapper.getComponent(DrawerRoot)
    const content = wrapper.getComponent(DrawerContent)

    expect(root.props('modal')).toBe(false)
    expect(content.props('initialFocus')).toBe(initialFocus)
    expect(content.props('finalFocus')).toBe(finalFocus)
    expect(content.props('forceMount')).toBe(true)
  })

  it('forwards content lifecycle events', () => {
    const wrapper = mountSheet({ defaultOpen: true })
    const content = wrapper.getComponent(DrawerContent)
    const events = {
      escapeKeyDown: new KeyboardEvent('keydown', { key: 'Escape' }),
      pointerDownOutside: new Event('pointerDownOutside'),
      focusOutside: new Event('focusOutside'),
      interactOutside: new Event('interactOutside'),
      openAutoFocus: new Event('openAutoFocus'),
      closeAutoFocus: new Event('closeAutoFocus'),
    }

    for (const [name, event] of Object.entries(events)) {
      content.vm.$emit(name, event)
      expect(wrapper.emitted(name)).toEqual([[event]])
    }
  })

  it('supports nested sheets through primitive context composition', async () => {
    const wrapper = mount(MkSheet, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Outer sheet',
      },
      slots: {
        footer: () =>
          h(
            MkSheet,
            { portal: false, side: 'bottom', title: 'Nested sheet' },
            {
              default: () => h('button', { type: 'button' }, 'Open nested'),
              content: () => 'Nested content',
            },
          ),
      },
    })

    await wrapper.get('.mk-sheet__footer button').trigger('click')
    await settle()

    const sheets = wrapper.findAll('[role="dialog"]')
    expect(sheets).toHaveLength(2)
    const nestedSheet = sheets[1]
    if (!nestedSheet) throw new Error('Expected nested Sheet content')
    expect(nestedSheet.attributes('data-mk-side')).toBe('bottom')
    expect(nestedSheet.text()).toContain('Nested content')
  })

  it('supports overlay, portal, and triggerless programmatic choices', async () => {
    const target = document.createElement('div')
    target.id = 'sheet-target'
    document.body.append(target)
    const customPortal = mount(MkSheet, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: '#sheet-target',
        title: 'Portalled sheet',
      },
      slots: { content: () => 'Custom target' },
    })
    const inline = mount(MkSheet, {
      attachTo: document.body,
      props: {
        open: true,
        overlay: false,
        portal: false,
        title: 'Inline sheet',
      },
      slots: { content: () => 'Inline content' },
    })

    await settle()

    expect(target.querySelector('.mk-sheet')?.textContent).toContain('Custom target')
    expect(inline.find('.mk-sheet').exists()).toBe(true)
    expect(inline.find('.mk-sheet__overlay').exists()).toBe(false)
    expect(inline.find('[aria-haspopup="dialog"]').exists()).toBe(false)

    customPortal.unmount()
    inline.unmount()
  })

  it('renders an accessible close button with a customizable graphic', async () => {
    const wrapper = mount(MkSheet, {
      attachTo: document.body,
      props: {
        closeLabel: 'Dismiss navigation',
        defaultOpen: true,
        portal: false,
        title: 'Navigation',
      },
      slots: {
        close: () => h('span', { class: 'custom-close' }, '×'),
      },
    })
    const close = wrapper.get('[aria-label="Dismiss navigation"]')

    expect(close.attributes('type')).toBe('button')
    expect(close.find('.custom-close').exists()).toBe(true)

    await close.trigger('click')
    await settle()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('merges global, local, and native classes in override order', () => {
    const wrapper = mount(MkSheet, {
      attachTo: document.body,
      global: {
        plugins: [
          createModeKit({
            ui: {
              sheet: {
                base: 'mk:w-72 global-content',
                variants: {
                  side: { left: 'global-side' },
                  size: { lg: 'mk:w-xl global-size' },
                  variant: { inset: 'global-variant' },
                },
                slots: {
                  overlay: 'global-overlay',
                  handle: 'global-handle',
                  container: 'global-container',
                  header: 'global-header',
                  wrapper: 'global-wrapper',
                  title: 'global-title',
                  description: 'global-description',
                  actions: 'global-actions',
                  body: 'mk:px-7 global-body',
                  footer: 'global-footer',
                  close: 'global-close',
                },
                defaultVariants: { side: 'left', size: 'lg', variant: 'inset' },
              },
            },
          }),
        ],
      },
      props: {
        defaultOpen: true,
        handle: true,
        portal: false,
        title: 'Configured sheet',
        description: 'Configured description',
        ui: {
          base: 'mk:w-2xl local-content',
          overlay: 'local-overlay',
          handle: 'local-handle',
          container: 'local-container',
          header: 'local-header',
          wrapper: 'local-wrapper',
          title: 'local-title',
          description: 'local-description',
          actions: 'local-actions',
          body: 'mk:px-8 local-body',
          footer: 'local-footer',
          close: 'local-close',
        },
        class: 'mk:w-3xl native-content',
      },
      slots: {
        actions: () => 'Actions',
        content: () => 'Content',
        footer: () => 'Footer',
      },
    })
    const sheet = wrapper.get('[role="dialog"]')

    expect(sheet.attributes('data-mk-side')).toBe('left')
    expect(sheet.attributes('data-mk-size')).toBe('lg')
    expect(sheet.attributes('data-mk-variant')).toBe('inset')
    expect(sheet.classes()).toEqual(
      expect.arrayContaining([
        'mk-sheet',
        'mk:w-3xl',
        'global-content',
        'global-side',
        'global-size',
        'global-variant',
        'local-content',
        'native-content',
      ]),
    )
    expect(sheet.classes()).not.toEqual(
      expect.arrayContaining(['mk:w-lg', 'mk:w-72', 'mk:w-xl', 'mk:w-2xl']),
    )
    expect(wrapper.get('.mk-sheet__overlay').classes()).toEqual(
      expect.arrayContaining(['global-overlay', 'local-overlay']),
    )
    expect(wrapper.get('.mk-sheet__handle').classes()).toEqual(
      expect.arrayContaining(['global-handle', 'local-handle']),
    )
    expect(wrapper.get('.mk-sheet__container').classes()).toEqual(
      expect.arrayContaining(['global-container', 'local-container']),
    )
    expect(wrapper.get('.mk-sheet__header').classes()).toEqual(
      expect.arrayContaining(['global-header', 'local-header']),
    )
    expect(wrapper.get('.mk-sheet__wrapper').classes()).toEqual(
      expect.arrayContaining(['global-wrapper', 'local-wrapper']),
    )
    expect(wrapper.get('.mk-sheet__actions').classes()).toEqual(
      expect.arrayContaining(['global-actions', 'local-actions']),
    )
    expect(wrapper.get('.mk-sheet__body').classes()).toEqual(
      expect.arrayContaining(['mk:px-8', 'global-body', 'local-body']),
    )
    expect(wrapper.get('.mk-sheet__body').classes()).not.toEqual(
      expect.arrayContaining(['mk:px-6', 'mk:px-7']),
    )
    expect(wrapper.get('.mk-sheet__close').classes()).toEqual(
      expect.arrayContaining(['global-close', 'local-close']),
    )
  })

  it('forwards native attributes and semantic root selection to content', () => {
    const wrapper = mount(MkSheet, {
      attachTo: document.body,
      props: {
        as: 'aside',
        defaultOpen: true,
        portal: false,
        title: 'Semantic sheet',
        id: 'account-sheet',
        'data-test': 'native-content',
      },
    })
    const sheet = wrapper.get('[role="dialog"]')

    expect(sheet.element.tagName).toBe('ASIDE')
    expect(sheet.attributes('id')).toBe('account-sheet')
    expect(sheet.attributes('data-test')).toBe('native-content')
    expect(sheet.attributes('aria-describedby')).toBeUndefined()
  })

  it('exports the complete curated axes', () => {
    expect(sheetSides).toEqual(['top', 'right', 'bottom', 'left'])
    expect(sheetSizes).toEqual(['sm', 'md', 'lg', 'xl'])
    expect(sheetVariants).toEqual(['edge', 'inset'])
  })
})
