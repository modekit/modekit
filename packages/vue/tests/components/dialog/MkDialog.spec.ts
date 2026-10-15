import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { DialogContent, DialogRoot } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import { createModeKit, dialogAnimations, dialogSizes, MkDialog } from '../../../src/index.js'
import type { DialogProps } from '../../../src/index.js'

function mountDialog(props: Partial<DialogProps> = {}): VueWrapper {
  return mount(MkDialog, {
    attachTo: document.body,
    props: {
      portal: false,
      title: 'Edit profile',
      description: 'Update the public details for this account.',
      ...props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'Open dialog'),
      content: () => h('input', { 'aria-label': 'Display name' }),
      footer: ({ close }) => h('button', { type: 'button', onClick: close }, 'Save'),
    },
  })
}

afterEach(async () => {
  await nextTick()
  await nextTick()
  document.body.replaceChildren()
  document.body.removeAttribute('style')
})

describe('MkDialog', () => {
  it('opens from a semantic trigger with labelled modal content', async () => {
    const wrapper = mountDialog()
    const trigger = wrapper.get('button')

    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await trigger.trigger('click')
    await nextTick()
    await nextTick()

    const dialog = wrapper.get('[role="dialog"]')
    const title = wrapper.get('.mk-dialog__title')
    const description = wrapper.get('.mk-dialog__description')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(dialog.attributes('id'))
    expect(dialog.attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(dialog.attributes('aria-describedby')).toBe(description.attributes('id'))
    expect(title.text()).toBe('Edit profile')
    expect(description.text()).toBe('Update the public details for this account.')
    expect(wrapper.get('.mk-dialog__overlay').attributes('data-state')).toBe('open')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const wrapper = mountDialog()
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
    const uncontrolled = mountDialog({ defaultOpen: true })
    const controlled = mountDialog({ open: true })

    expect(uncontrolled.find('[role="dialog"]').exists()).toBe(true)
    expect(controlled.find('[role="dialog"]').exists()).toBe(true)

    await controlled.get('[aria-label="Close dialog"]').trigger('click')
    await nextTick()

    expect(controlled.emitted('update:open')).toEqual([[false]])
    expect(controlled.find('[role="dialog"]').exists()).toBe(true)
  })

  it('gives body and footer slots state and a close action', async () => {
    const wrapper = mount(MkDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Slot actions',
        description: 'Dialog with slot actions.',
      },
      slots: {
        content: ({ open, close }) =>
          h('button', { 'data-open': String(open), onClick: close }, 'Close from body'),
        footer: ({ open }) => h('span', { 'data-footer-open': String(open) }, 'Footer'),
      },
    })

    expect(wrapper.get('.mk-dialog__body button').attributes('data-open')).toBe('true')
    expect(wrapper.get('.mk-dialog__footer span').attributes('data-footer-open')).toBe('true')

    await wrapper.get('.mk-dialog__body button').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('supports rich title and description slots', () => {
    const wrapper = mount(MkDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Fallback title',
        description: 'Fallback description',
      },
      slots: {
        title: ({ title, open }) => h('strong', { 'data-open': String(open) }, title),
        description: ({ description }) => h('em', description),
        content: () => 'Content',
      },
    })

    expect(wrapper.get('.mk-dialog__title strong').text()).toBe('Fallback title')
    expect(wrapper.get('.mk-dialog__title strong').attributes('data-open')).toBe('true')
    expect(wrapper.get('.mk-dialog__description em').text()).toBe('Fallback description')
  })

  it.each(dialogSizes)('renders the %s size contract', (size) => {
    const wrapper = mountDialog({ defaultOpen: true, size })
    const dialog = wrapper.get('[role="dialog"]')

    expect(dialog.attributes('data-mk-size')).toBe(size)
    expect(dialog.classes()).toContain(
      {
        sm: 'mk:max-w-sm',
        md: 'mk:max-w-lg',
        lg: 'mk:max-w-2xl',
        xl: 'mk:max-w-4xl',
      }[size],
    )
  })

  it.each(dialogAnimations)('renders the %s animation contract', (animation) => {
    const wrapper = mountDialog({ animation, defaultOpen: true })
    const dialog = wrapper.get('[role="dialog"]')
    const overlay = wrapper.get('.mk-dialog__overlay')

    expect(dialog.attributes('data-mk-animation')).toBe(animation)
    expect(dialog.classes()).toContain('mk:origin-center')

    if (animation === 'none') {
      expect(dialog.classes()).toContain('mk:animate-none')
      expect(overlay.classes()).toContain('mk:animate-none')
    } else {
      expect(
        dialog.classes().some((className) => className.includes(`mk-dialog-${animation}`)),
      ).toBe(true)
      expect(overlay.classes()).toContain(
        'mk:data-[state=open]:animate-[mk-dialog-overlay-open_160ms_ease-out]',
      )
    }
  })

  it('forwards modal and persistent-mount behavior to the root', () => {
    const wrapper = mountDialog({ defaultOpen: true, modal: false, unmountOnHide: false })
    const root = wrapper.getComponent(DialogRoot)

    expect(root.props('modal')).toBe(false)
    expect(root.props('unmountOnHide')).toBe(false)
  })

  it('portals to the body by default and supports custom and inline targets', async () => {
    const defaultPortal = mount(MkDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        title: 'Default portal',
        description: 'Default portal description.',
      },
      slots: { content: () => 'Default content' },
    })
    const target = document.createElement('div')
    target.id = 'dialog-target'
    document.body.append(target)
    const customPortal = mount(MkDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: '#dialog-target',
        title: 'Custom portal',
        description: 'Custom portal description.',
      },
      slots: { content: () => 'Custom content' },
    })
    const inline = mount(MkDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Inline dialog',
        description: 'Inline dialog description.',
        modal: false,
      },
      slots: { content: () => 'Inline content' },
    })

    await nextTick()
    await nextTick()

    expect(document.body.textContent).toContain('Default content')
    expect(target.querySelector('.mk-dialog')?.textContent).toContain('Custom content')
    expect(inline.find('.mk-dialog').exists()).toBe(true)

    defaultPortal.unmount()
    customPortal.unmount()
    inline.unmount()
  })

  it('can render without a trigger for programmatic state', () => {
    const wrapper = mount(MkDialog, {
      attachTo: document.body,
      props: {
        open: true,
        portal: false,
        title: 'Programmatic dialog',
        description: 'Opened programmatically.',
      },
      slots: { content: () => 'Opened by state' },
    })

    expect(wrapper.find('[aria-haspopup="dialog"]').exists()).toBe(false)
    expect(wrapper.get('[role="dialog"]').text()).toContain('Opened by state')
  })

  it('renders an accessible close button with a customizable graphic', async () => {
    const wrapper = mount(MkDialog, {
      attachTo: document.body,
      props: {
        closeLabel: 'Dismiss editor',
        defaultOpen: true,
        portal: false,
        title: 'Editor',
        description: 'Customize the close control.',
      },
      slots: {
        content: () => 'Content',
        close: () => h('span', { class: 'custom-close' }, '×'),
      },
    })
    const close = wrapper.get('[aria-label="Dismiss editor"]')

    expect(close.attributes('type')).toBe('button')
    expect(close.find('.custom-close').exists()).toBe(true)

    await close.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('can omit the built-in close button', () => {
    const wrapper = mountDialog({ closeButton: false, defaultOpen: true })

    expect(wrapper.find('.mk-dialog__close').exists()).toBe(false)
  })

  it.each(['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside'] as const)(
    'prevents %s dismissal when dismissible is false',
    (eventName) => {
      const wrapper = mountDialog({ defaultOpen: true, dismissible: false })
      const event =
        eventName === 'escapeKeyDown'
          ? new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' })
          : new Event(eventName, { cancelable: true })

      wrapper.getComponent(DialogContent).vm.$emit(eventName, event)

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted(eventName)).toEqual([[event]])
    },
  )

  it('forwards focus lifecycle events without preventing them', () => {
    const wrapper = mountDialog({ defaultOpen: true })
    const openEvent = new Event('openAutoFocus', { cancelable: true })
    const closeEvent = new Event('closeAutoFocus', { cancelable: true })
    const content = wrapper.getComponent(DialogContent)

    content.vm.$emit('openAutoFocus', openEvent)
    content.vm.$emit('closeAutoFocus', closeEvent)

    expect(openEvent.defaultPrevented).toBe(false)
    expect(closeEvent.defaultPrevented).toBe(false)
    expect(wrapper.emitted('openAutoFocus')).toEqual([[openEvent]])
    expect(wrapper.emitted('closeAutoFocus')).toEqual([[closeEvent]])
  })

  it('forwards native attributes and semantic root selection to content', () => {
    const wrapper = mount(MkDialog, {
      attachTo: document.body,
      props: {
        as: 'section',
        defaultOpen: true,
        portal: false,
        title: 'Semantic dialog',
        description: 'Uses a semantic content root.',
        id: 'account-dialog',
        'data-test': 'native-content',
      },
      slots: { content: () => 'Content' },
    })
    const dialog = wrapper.get('[role="dialog"]')

    expect(dialog.element.tagName).toBe('SECTION')
    expect(dialog.attributes('id')).toBe('account-dialog')
    expect(dialog.attributes('data-test')).toBe('native-content')
  })

  it('merges global, local, and native classes in override order', () => {
    const wrapper = mount(MkDialog, {
      attachTo: document.body,
      global: {
        plugins: [
          createModeKit({
            ui: {
              dialog: {
                base: 'mk:max-w-xl global-content',
                variants: {
                  size: { lg: 'mk:max-w-3xl global-size' },
                  animation: { fade: 'global-animation' },
                },
                slots: {
                  overlay: 'global-overlay',
                  header: 'global-header',
                  title: 'global-title',
                  description: 'global-description',
                  body: 'mk:px-7 global-body',
                  footer: 'global-footer',
                  close: 'global-close',
                },
                defaultVariants: { size: 'lg', animation: 'fade' },
              },
            },
          }),
        ],
      },
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Configured dialog',
        description: 'Configured description',
        ui: {
          base: 'mk:max-w-5xl local-content',
          overlay: 'local-overlay',
          header: 'local-header',
          title: 'local-title',
          description: 'local-description',
          body: 'mk:px-8 local-body',
          footer: 'local-footer',
          close: 'local-close',
        },
        class: 'mk:max-w-6xl native-content',
      },
      slots: {
        content: () => 'Content',
        footer: () => 'Footer',
      },
    })
    const dialog = wrapper.get('[role="dialog"]')

    expect(dialog.attributes('data-mk-size')).toBe('lg')
    expect(dialog.attributes('data-mk-animation')).toBe('fade')
    expect(dialog.classes()).toEqual(
      expect.arrayContaining([
        'mk-dialog',
        'mk:max-w-6xl',
        'global-content',
        'global-size',
        'global-animation',
        'local-content',
        'native-content',
      ]),
    )
    expect(dialog.classes()).not.toEqual(
      expect.arrayContaining(['mk:max-w-2xl', 'mk:max-w-xl', 'mk:max-w-3xl', 'mk:max-w-5xl']),
    )
    expect(wrapper.get('.mk-dialog__overlay').classes()).toEqual(
      expect.arrayContaining(['global-overlay', 'local-overlay']),
    )
    expect(wrapper.get('.mk-dialog__header').classes()).toEqual(
      expect.arrayContaining(['global-header', 'local-header']),
    )
    expect(wrapper.get('.mk-dialog__title').classes()).toEqual(
      expect.arrayContaining(['global-title', 'local-title']),
    )
    expect(wrapper.get('.mk-dialog__description').classes()).toEqual(
      expect.arrayContaining(['global-description', 'local-description']),
    )
    expect(wrapper.get('.mk-dialog__body').classes()).toEqual(
      expect.arrayContaining(['mk:px-8', 'global-body', 'local-body']),
    )
    expect(wrapper.get('.mk-dialog__body').classes()).not.toEqual(
      expect.arrayContaining(['mk:px-6', 'mk:px-7']),
    )
    expect(wrapper.get('.mk-dialog__footer').classes()).toEqual(
      expect.arrayContaining(['global-footer', 'local-footer']),
    )
    expect(wrapper.get('.mk-dialog__close').classes()).toEqual(
      expect.arrayContaining(['global-close', 'local-close']),
    )
  })

  it('exports its finite size and animation contracts', () => {
    expect(dialogSizes).toEqual(['sm', 'md', 'lg', 'xl'])
    expect(dialogAnimations).toEqual(['scale', 'fade', 'slide-up', 'slide-down', 'none'])
  })
})
