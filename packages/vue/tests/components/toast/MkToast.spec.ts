/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import { ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import type { Component, Slots } from 'vue'

import {
  createModeKit,
  MkToast,
  MkToastProvider,
  toastColors,
  toastVariants,
  useToast,
} from '../../../src/index.js'
import type { ToastApi, ToastProps, ToastSwipeEvent } from '../../../src/index.js'

function mountToast(props: Partial<ToastProps> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h(
            MkToastProvider,
            { portal: false },
            {
              default: () =>
                h(
                  MkToast as Component,
                  {
                    title: 'Changes saved',
                    description: 'Your workspace is up to date.',
                    ...props,
                  },
                  slots as Slots,
                ),
            },
          )
      },
    }),
    { attachTo: document.body },
  )
}

afterEach(async () => {
  await nextTick()
  document.body.replaceChildren()
})

describe('MkToastProvider', () => {
  it('provides accessible defaults and a positioned viewport', async () => {
    const wrapper = mountToast()
    await nextTick()

    const viewport = wrapper.get('.mk-toast-viewport')

    expect(wrapper.getComponent(ToastViewport).props('hotkey')).toEqual(['F8'])
    const region = wrapper.get('[role="region"]')

    expect(viewport.element.tagName).toBe('OL')
    expect(region.attributes('aria-label')).toBe('Notifications (F8)')
    expect(viewport.attributes('data-mk-position')).toBe('top-right')
    expect(viewport.classes()).toContain('mk:top-0')
    expect(viewport.classes()).toContain('mk:right-0')
    expect(viewport.classes()).toContain('mk:box-border')
  })

  it('stacks composable notifications by default and supports their lifecycle', async () => {
    let toastApi: ToastApi | undefined

    const Consumer = defineComponent({
      setup() {
        toastApi = useToast()
        return () =>
          h('button', {
            onClick: () => {
              toastApi?.add({ id: 'first', title: 'First notification', duration: 0 })
              toastApi?.add({ id: 'second', title: 'Second notification', duration: 0 })
            },
          })
      },
    })

    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(MkToastProvider, { portal: false }, { default: () => h(Consumer) })
        },
      }),
      { attachTo: document.body },
    )

    await wrapper.get('button').trigger('click')
    await nextTick()

    expect(wrapper.findAll('.mk-toast')).toHaveLength(2)
    expect(wrapper.findAll('.mk-toast__title').map((title) => title.text())).toEqual([
      'First notification',
      'Second notification',
    ])
    expect(wrapper.get('.mk-toast-viewport').classes()).toContain('mk:gap-3')
    expect(toastApi?.toasts.value).toHaveLength(2)

    toastApi?.update('first', { title: 'Updated notification', color: 'green' })
    await nextTick()
    expect(wrapper.findAll('.mk-toast__title')[0]?.text()).toBe('Updated notification')
    expect(wrapper.findAll('.mk-toast')[0]?.attributes('data-mk-color')).toBe('green')

    toastApi?.add({ id: 'first', title: 'Deduplicated notification', duration: 0 })
    await nextTick()
    expect(wrapper.findAll('.mk-toast')).toHaveLength(2)
    expect(wrapper.findAll('.mk-toast__title')[0]?.text()).toBe('Deduplicated notification')

    toastApi?.remove('first')
    await nextTick()
    expect(toastApi?.toasts.value.find((toast) => toast.id === 'first')?.open).toBe(false)

    toastApi?.clear()
    await nextTick()
    expect(toastApi?.toasts.value.every((toast) => !toast.open)).toBe(true)
  })

  it('renders and invokes multiple actions from useToast', async () => {
    const firstAction = vi.fn()
    const secondAction = vi.fn()

    const Consumer = defineComponent({
      setup() {
        const toast = useToast()
        return () =>
          h(
            'button',
            {
              onClick: () => {
                toast.add({
                  title: 'Multiple actions',
                  duration: 0,
                  actions: [
                    {
                      label: 'Undo',
                      altText: 'Undo the change',
                      closeOnClick: false,
                      onClick: firstAction,
                    },
                    {
                      label: () => h('strong', 'View details'),
                      altText: 'View change details',
                      closeOnClick: false,
                      onClick: secondAction,
                    },
                  ],
                })
              },
            },
            'Add actionable toast',
          )
      },
    })

    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(MkToastProvider, { portal: false }, { default: () => h(Consumer) })
        },
      }),
      { attachTo: document.body },
    )

    await wrapper.get('button').trigger('click')
    await nextTick()

    const actions = wrapper.findAll('.mk-toast__action')
    expect(actions).toHaveLength(2)
    expect(actions.map((action) => action.text())).toEqual(['Undo', 'View details'])

    await actions[0]?.trigger('click')
    await actions[1]?.trigger('click')
    await nextTick()

    expect(firstAction).toHaveBeenCalledOnce()
    expect(secondAction).toHaveBeenCalledOnce()
    expect(wrapper.find('.mk-toast').exists()).toBe(true)
  })

  it('requires useToast consumers to be nested under the provider', () => {
    const Consumer = defineComponent({
      setup() {
        useToast()
        return () => h('div')
      },
    })

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      expect(() => mount(Consumer)).toThrow('useToast must be called within MkToastProvider.')
    } finally {
      warn.mockRestore()
    }
  })

  it('forwards provider behavior and viewport customization', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              MkToastProvider,
              {
                portal: false,
                duration: 9000,
                disableSwipe: true,
                swipeDirection: 'left',
                swipeThreshold: 80,
                limit: 2,
                hotkey: ['Control', 'KeyN'],
                viewportLabel: 'Updates ({hotkey})',
                position: 'bottom-left',
                ui: { viewport: 'viewport-local' },
                class: 'viewport-native',
              },
              { default: () => h(MkToast, { title: 'Configured' }) },
            )
        },
      }),
      { attachTo: document.body },
    )
    await nextTick()

    const viewport = wrapper.get('.mk-toast-viewport')
    const provider = wrapper.getComponent(ToastProvider)
    const root = wrapper.getComponent(ToastRoot)

    expect(provider.props('duration')).toBe(9000)
    expect(provider.props('disableSwipe')).toBe(true)
    expect(provider.props('swipeDirection')).toBe('left')
    expect(provider.props('swipeThreshold')).toBe(80)
    expect(provider.props('limit')).toBe(2)
    expect(root.props('duration')).toBeUndefined()
    expect(wrapper.get('[role="region"]').attributes('aria-label')).toBe('Updates (Control+N)')
    expect(viewport.attributes('data-mk-position')).toBe('bottom-left')
    expect(viewport.classes()).toContain('mk:bottom-0')
    expect(viewport.classes()).toContain('mk:left-0')
    expect(viewport.classes()).toContain('viewport-local')
    expect(viewport.classes()).toContain('viewport-native')
  })
})

describe('MkToast', () => {
  it('renders semantic title and description with safe visual defaults', async () => {
    const wrapper = mountToast()
    await nextTick()
    const toast = wrapper.get('.mk-toast')

    expect(toast.element.tagName).toBe('LI')
    expect(toast.attributes('tabindex')).toBe('0')
    expect(toast.attributes('data-state')).toBe('open')
    expect(toast.attributes('data-mk-color')).toBe('neutral')
    expect(toast.attributes('data-mk-variant')).toBe('solid')
    expect(toast.classes()).toContain('mk:border-0')
    expect(toast.classes()).toContain('mk:bg-component')
    expect(toast.classes()).toContain(
      'mk:data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)]',
    )
    expect(toast.classes()).toContain(
      'mk:data-[swipe=end]:animate-[mk-toast-swipe-end_160ms_ease-out]',
    )
    expect(toast.classes()).toContain('mk:motion-reduce:data-[state=open]:animate-none')
    expect(wrapper.get('.mk-toast__body').classes()).toEqual(
      expect.arrayContaining(['mk:col-start-1', 'mk:row-start-1', 'mk:min-w-0']),
    )
    expect(wrapper.get('.mk-toast__title').text()).toBe('Changes saved')
    expect(wrapper.get('.mk-toast__description').text()).toBe('Your workspace is up to date.')
    expect(wrapper.get('.mk-toast__close').attributes('aria-label')).toBe('Dismiss notification')
    expect(wrapper.get('.mk-toast__close').classes()).toEqual(
      expect.arrayContaining(['mk:col-start-2', 'mk:row-start-1']),
    )
  })

  it.each(toastVariants)('renders the %s treatment independently from color', async (variant) => {
    const wrapper = mountToast({ color: 'red', variant })
    await nextTick()
    const toast = wrapper.get('.mk-toast')

    expect(toast.attributes('data-mk-color')).toBe('red')
    expect(toast.attributes('data-mk-variant')).toBe(variant)
    expect(toast.classes()).toContain(
      {
        solid: 'mk:bg-component',
        soft: 'mk:bg-[color-mix(in_oklab,var(--mk-component-color)_15%,white)]',
        outline: 'mk:bg-white',
      }[variant],
    )
  })

  it('renders icon, rich content, action, and close slots in an accessible structure', async () => {
    const wrapper = mountToast(
      { actionAltText: 'Undo the saved change', closeLabel: 'Dismiss saved notification' },
      {
        icon: () => h('svg', { 'data-slot': 'icon' }),
        title: ({ title }: { title: string }) => h('strong', { 'data-slot': 'title' }, title),
        default: ({ description }: { description: string }) =>
          h('span', { 'data-slot': 'description' }, description),
        action: ({ altText }: { altText: string }) => h('span', { 'data-alt': altText }, 'Undo'),
        close: ({ label }: { label: string }) => h('span', { 'data-label': label }, '×'),
      },
    )
    await nextTick()

    expect(wrapper.get('.mk-toast__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[data-slot="title"]').text()).toBe('Changes saved')
    expect(wrapper.get('[data-slot="description"]').text()).toBe('Your workspace is up to date.')
    expect(wrapper.get('.mk-toast__action').attributes('type')).toBe('button')
    expect(wrapper.get('.mk-toast__content').find('.mk-toast__action').exists()).toBe(true)
    expect(wrapper.get('.mk-toast__action [data-alt]').attributes('data-alt')).toBe(
      'Undo the saved change',
    )
    expect(wrapper.get('.mk-toast__close').attributes('type')).toBe('button')
    expect(wrapper.get('.mk-toast__close [data-label]').attributes('data-label')).toBe(
      'Dismiss saved notification',
    )
  })

  it('supports controlled open state and emits close requests', async () => {
    const open = ref(true)
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              MkToastProvider,
              { portal: false },
              {
                default: () =>
                  h(MkToast, {
                    open: open.value,
                    title: 'Controlled',
                    'onUpdate:open': (value: unknown) => {
                      if (typeof value === 'boolean') open.value = value
                    },
                  }),
              },
            )
        },
      }),
      { attachTo: document.body },
    )
    await nextTick()

    await wrapper.get('.mk-toast__close').trigger('click')
    await nextTick()

    expect(open.value).toBe(false)
    expect(wrapper.find('.mk-toast').exists()).toBe(false)
  })

  it('closes from an action by default', async () => {
    const wrapper = mountToast({ actionAltText: 'Undo the saved change' }, { action: () => 'Undo' })
    await nextTick()
    const toast = wrapper.getComponent(MkToast)

    await wrapper.get('.mk-toast__action').trigger('click')
    await nextTick()

    expect(toast.emitted('action')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(toast.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('.mk-toast').exists()).toBe(false)
  })

  it('emits action and honors actionCloseOnClick', async () => {
    const wrapper = mountToast(
      { actionAltText: 'Retry saving', actionCloseOnClick: false },
      { action: () => 'Retry' },
    )
    await nextTick()
    const toast = wrapper.getComponent(MkToast)

    await wrapper.get('.mk-toast__action').trigger('click')
    await nextTick()

    expect(toast.emitted('action')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(wrapper.find('.mk-toast').exists()).toBe(true)
  })

  it('forwards lifecycle and swipe events from Reka Toast', async () => {
    const wrapper = mountToast()
    await nextTick()
    const toast = wrapper.getComponent(MkToast)
    const root = wrapper.getComponent(ToastRoot)
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    const swipeEvent = new CustomEvent('toast.swipeStart', {
      detail: { originalEvent: new PointerEvent('pointerdown'), delta: { x: 4, y: 0 } },
    }) as ToastSwipeEvent

    root.vm.$emit('escapeKeyDown', escapeEvent)
    root.vm.$emit('pause')
    root.vm.$emit('resume')
    root.vm.$emit('swipeStart', swipeEvent)

    expect(toast.emitted('escapeKeyDown')).toEqual([[escapeEvent]])
    expect(toast.emitted('pause')).toEqual([[]])
    expect(toast.emitted('resume')).toEqual([[]])
    expect(toast.emitted('swipeStart')).toEqual([[swipeEvent]])
  })

  it('merges global, local, and native class overrides in order', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              MkToastProvider,
              { portal: false },
              {
                default: () =>
                  h(MkToast, {
                    title: 'Customized',
                    ui: {
                      base: 'rounded-none local-root',
                      body: 'local-body',
                      title: 'local-title',
                    },
                    class: 'rounded-full native-root',
                  }),
              },
            )
        },
      }),
      {
        attachTo: document.body,
        global: {
          plugins: [
            createModeKit({
              ui: {
                toast: {
                  base: 'global-root',
                  variants: { color: { red: 'global-color' }, variant: { soft: 'global-variant' } },
                  slots: { body: 'global-body', title: 'global-title' },
                  defaultVariants: { color: 'red', variant: 'soft' },
                },
                toastProvider: {
                  base: 'global-viewport',
                  variants: { position: { 'bottom-right': 'global-position' } },
                  defaultVariants: { position: 'bottom-right' },
                },
              },
            }),
          ],
        },
      },
    )
    await nextTick()

    const toast = wrapper.get('.mk-toast')
    const viewport = wrapper.get('.mk-toast-viewport')

    expect(toast.attributes('data-mk-color')).toBe('red')
    expect(toast.attributes('data-mk-variant')).toBe('soft')
    expect(toast.classes()).toContain('global-root')
    expect(toast.classes()).toContain('global-color')
    expect(toast.classes()).toContain('global-variant')
    expect(toast.classes()).toContain('native-root')
    expect(toast.classes()).toContain('rounded-full')
    expect(toast.classes()).not.toContain('rounded-none')
    expect(wrapper.get('.mk-toast__body').classes()).toContain('global-body')
    expect(wrapper.get('.mk-toast__body').classes()).toContain('local-body')
    expect(wrapper.get('.mk-toast__title').classes()).toContain('global-title')
    expect(wrapper.get('.mk-toast__title').classes()).toContain('local-title')
    expect(viewport.attributes('data-mk-position')).toBe('bottom-right')
    expect(viewport.classes()).toContain('global-viewport')
    expect(viewport.classes()).toContain('global-position')
  })

  it.each(toastColors)('accepts the shared %s semantic color', async (color) => {
    const wrapper = mountToast({ color })
    await nextTick()
    expect(wrapper.get('.mk-toast').attributes('data-mk-color')).toBe(color)
  })
})
