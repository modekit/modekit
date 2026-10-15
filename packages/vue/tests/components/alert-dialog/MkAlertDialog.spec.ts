import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { AlertDialogContent, AlertDialogRoot } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import { createModeKit, MkAlertDialog, MkButton } from '../../../src/index.js'
import type { AlertDialogProps } from '../../../src/index.js'

function mountAlertDialog(props: Partial<AlertDialogProps> = {}): VueWrapper {
  return mount(MkAlertDialog, {
    attachTo: document.body,
    props: {
      portal: false,
      title: 'Delete project?',
      description: 'This action cannot be undone.',
      ...props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'Delete project'),
    },
  })
}

async function settle() {
  await nextTick()
  await nextTick()
}

afterEach(async () => {
  await settle()
  document.body.replaceChildren()
  document.body.removeAttribute('style')
})

describe('MkAlertDialog', () => {
  it('opens labelled alertdialog content and focuses the safe action', async () => {
    const wrapper = mountAlertDialog()
    const trigger = wrapper.get('button')

    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    await trigger.trigger('click')
    await settle()

    const dialog = wrapper.get('[role="alertdialog"]')
    const title = wrapper.get('.mk-alert-dialog__title')
    const description = wrapper.get('.mk-alert-dialog__description')
    const cancel = wrapper.get('.mk-alert-dialog__cancel')

    expect(dialog.attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(dialog.attributes('aria-describedby')).toBe(description.attributes('id'))
    expect(cancel.text()).toBe('Cancel')
    expect(cancel.classes()).toContain('mk:border-0')
    expect(cancel.classes()).toContain('mk:bg-transparent')
    expect(wrapper.get('.mk-alert-dialog__footer').classes()).toContain('mk:pt-6')
    expect(document.activeElement).toBe(cancel.element)
  })

  it('does not dismiss on Escape', async () => {
    const wrapper = mountAlertDialog({ defaultOpen: true })

    await wrapper.get('[role="alertdialog"]').trigger('keydown', { key: 'Escape' })
    await settle()

    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it.each(['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside'] as const)(
    'prevents %s dismissal',
    (eventName) => {
      const wrapper = mountAlertDialog({ defaultOpen: true })
      const event = new Event(eventName, { cancelable: true })

      wrapper.getComponent(AlertDialogContent).vm.$emit(eventName, event)

      expect(event.defaultPrevented).toBe(true)
    },
  )

  it('does not add the description gap when supporting content is present', () => {
    const wrapper = mount(MkAlertDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Delete project?',
        description: 'This action cannot be undone.',
      },
      slots: {
        content: () => h('p', 'All project data will be removed permanently.'),
      },
    })

    expect(wrapper.get('.mk-alert-dialog__footer').classes()).not.toContain('mk:pt-6')
  })

  it('emits cancel and closes through the safe action', async () => {
    const wrapper = mountAlertDialog({ defaultOpen: true })

    await wrapper.get('.mk-alert-dialog__cancel').trigger('click')
    await settle()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false)
  })

  it('emits action and closes through confirmation', async () => {
    const wrapper = mountAlertDialog({ defaultOpen: true })

    await wrapper.get('.mk-alert-dialog__action').trigger('click')
    await settle()

    expect(wrapper.emitted('action')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false)
  })

  it('supports controlled and triggerless state', async () => {
    const wrapper = mount(MkAlertDialog, {
      attachTo: document.body,
      props: {
        open: true,
        portal: false,
        title: 'Controlled alert',
        description: 'Application state owns visibility.',
      },
    })

    expect(wrapper.find('[aria-haspopup="dialog"]').exists()).toBe(false)
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true)

    await wrapper.get('.mk-alert-dialog__cancel').trigger('click')
    await settle()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true)
  })

  it('supports custom action and cancel controls', () => {
    const wrapper = mount(MkAlertDialog, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        portal: false,
        title: 'Custom controls',
        description: 'Uses consumer-owned controls.',
      },
      slots: {
        cancel: () => h(MkButton, { class: 'custom-cancel' }, () => 'Keep it'),
        action: () => h(MkButton, { class: 'custom-action' }, () => 'Remove it'),
      },
    })

    expect(wrapper.get('.custom-cancel').classes()).toContain('mk-alert-dialog__cancel')
    expect(wrapper.get('.custom-action').classes()).toContain('mk-alert-dialog__action')
  })

  it('forwards persistent mounting to the root', () => {
    const wrapper = mountAlertDialog({ defaultOpen: true, unmountOnHide: false })

    expect(wrapper.getComponent(AlertDialogRoot).props('unmountOnHide')).toBe(false)
  })

  it.each(['sm', 'md', 'lg', 'xl'] as const)('renders the %s size contract', (size) => {
    const wrapper = mountAlertDialog({ defaultOpen: true, size })

    expect(wrapper.get('[role="alertdialog"]').attributes('data-mk-size')).toBe(size)
  })

  it.each(['scale', 'fade', 'slide-up', 'slide-down', 'none'] as const)(
    'renders the %s animation contract',
    (animation) => {
      const wrapper = mountAlertDialog({ animation, defaultOpen: true })
      const dialog = wrapper.get('[role="alertdialog"]')

      expect(dialog.attributes('data-mk-animation')).toBe(animation)
      expect(dialog.classes()).toContain('mk:origin-center')
    },
  )

  it('merges global, local, and native classes', () => {
    const wrapper = mount(MkAlertDialog, {
      attachTo: document.body,
      global: {
        plugins: [
          createModeKit({
            ui: {
              alertDialog: {
                base: 'global-base',
                slots: { action: 'global-action' },
                defaultVariants: { size: 'lg', animation: 'fade' },
              },
            },
          }),
        ],
      },
      props: {
        class: 'native-base',
        defaultOpen: true,
        portal: false,
        title: 'Configured alert',
        description: 'Configured description.',
        ui: { base: 'local-base', action: 'local-action' },
      },
    })
    const dialog = wrapper.get('[role="alertdialog"]')

    expect(dialog.attributes('data-mk-size')).toBe('lg')
    expect(dialog.attributes('data-mk-animation')).toBe('fade')
    expect(dialog.classes()).toEqual(
      expect.arrayContaining(['global-base', 'local-base', 'native-base']),
    )
    expect(wrapper.get('.mk-alert-dialog__action').classes()).toEqual(
      expect.arrayContaining(['global-action', 'local-action']),
    )
  })
})
