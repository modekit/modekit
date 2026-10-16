import { ToastPortal, ToastProvider, ToastViewport } from 'reka-ui'
import { defineComponent, h, onUnmounted, provide, shallowRef } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkToast } from './MkToast.js'
import { getToastViewportClasses } from './styles/index.js'
import {
  toastPositions,
  toastSwipeDirections,
  type ToastContent,
  type ToastData,
  type ToastId,
  type ToastInstance,
  type ToastPortalTarget,
  type ToastPosition,
  type ToastProviderSlots,
  type ToastProviderUI,
  type ToastState,
  type ToastSwipeDirection,
} from './types.js'
import { toastContextKey } from './useToast.js'

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0
}

function renderContent(content: ToastContent): VNodeChild {
  return typeof content === 'function' ? content() : content
}

let generatedToastId = 0

export const MkToastProvider = defineComponent({
  name: 'MkToastProvider',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: 'Notification',
      validator: (value: string) => value.trim().length > 0,
    },
    duration: {
      type: Number,
      default: 5000,
      validator: isNonNegativeFiniteNumber,
    },
    disableSwipe: {
      type: Boolean,
      default: false,
    },
    swipeDirection: {
      type: String as PropType<ToastSwipeDirection>,
      default: 'right',
      validator: (value: ToastSwipeDirection) => toastSwipeDirections.includes(value),
    },
    swipeThreshold: {
      type: Number,
      default: 50,
      validator: isNonNegativeFiniteNumber,
    },
    limit: {
      type: Number,
      default: undefined,
      validator: isPositiveInteger,
    },
    hotkey: {
      type: Array as PropType<string[]>,
      default: () => ['F8'],
    },
    viewportLabel: {
      type: [String, Function] as PropType<string | ((hotkey: string) => string)>,
      default: 'Notifications ({hotkey})',
    },
    position: {
      type: String as PropType<ToastPosition>,
      default: undefined,
      validator: (value: ToastPosition) => toastPositions.includes(value),
    },
    portal: {
      type: [Boolean, String, Object] as PropType<ToastPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<ToastProviderUI>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<ToastProviderSlots>,
  setup(props, { attrs, slots }) {
    const options = useModeKitOptions()
    const toasts = shallowRef<ToastState[]>([])
    const removalTimers = new Map<ToastId, ReturnType<typeof setTimeout>>()

    function clearRemovalTimer(id: ToastId): void {
      const timer = removalTimers.get(id)
      if (timer !== undefined) clearTimeout(timer)
      removalTimers.delete(id)
    }

    function removeState(id: ToastId): void {
      clearRemovalTimer(id)
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    function scheduleRemoval(id: ToastId): void {
      clearRemovalTimer(id)
      removalTimers.set(
        id,
        setTimeout(() => {
          removeState(id)
        }, 200),
      )
    }

    function add(toast: ToastData): ToastInstance {
      const { id: requestedId, ...data } = toast
      const id = requestedId ?? `mk-toast-${String(++generatedToastId)}`
      const existingIndex = toasts.value.findIndex((item) => item.id === id)
      clearRemovalTimer(id)

      if (existingIndex === -1) {
        toasts.value = [...toasts.value, { ...data, id, open: true }]
      } else {
        const existing = toasts.value[existingIndex]
        if (existing !== undefined) {
          toasts.value = toasts.value.map((item, index) =>
            index === existingIndex ? { ...existing, ...data, id, open: true } : item,
          )
        }
      }

      return { id }
    }

    function update(id: ToastId, toast: Partial<ToastData>): ToastInstance | undefined {
      const index = toasts.value.findIndex((item) => item.id === id)
      if (index === -1) return undefined

      const data = { ...toast }
      delete data.id
      const existing = toasts.value[index]
      if (existing === undefined) return undefined

      toasts.value = toasts.value.map((item, itemIndex) =>
        itemIndex === index ? { ...existing, ...data, id } : item,
      )
      return { id }
    }

    function remove(id: ToastId): void {
      const toast = toasts.value.find((item) => item.id === id)
      if (!toast) return

      toasts.value = toasts.value.map((item) => (item.id === id ? { ...item, open: false } : item))
      toast.onUpdateOpen?.(false)
      scheduleRemoval(id)
    }

    function clear(): void {
      for (const toast of toasts.value) remove(toast.id)
    }

    function handleOpenChange(toast: ToastState, open: boolean): void {
      toasts.value = toasts.value.map((item) => (item.id === toast.id ? { ...item, open } : item))
      toast.onUpdateOpen?.(open)
      if (!open) scheduleRemoval(toast.id)
    }

    provide(toastContextKey, { toasts, add, update, remove, clear })

    onUnmounted(() => {
      for (const timer of removalTimers.values()) clearTimeout(timer)
      removalTimers.clear()
    })

    function renderManagedToast(toast: ToastState): VNodeChild {
      const icon = toast.icon
      const title = toast.title
      const description = toast.description
      const actions = toast.actions

      return h(
        MkToast as Component,
        {
          key: toast.id,
          open: toast.open,
          ...(toast.duration === undefined ? undefined : { duration: toast.duration }),
          ...(toast.type === undefined ? undefined : { type: toast.type }),
          ...(toast.color === undefined ? undefined : { color: toast.color }),
          ...(toast.variant === undefined ? undefined : { variant: toast.variant }),
          ...(toast.closeButton === undefined ? undefined : { closeButton: toast.closeButton }),
          ...(toast.closeLabel === undefined ? undefined : { closeLabel: toast.closeLabel }),
          ...(actions === undefined ? undefined : { actions }),
          'onUpdate:open': (open: unknown) => {
            if (typeof open === 'boolean') handleOpenChange(toast, open)
          },
        },
        {
          ...(icon === undefined ? undefined : { icon: () => renderContent(icon) }),
          ...(title === undefined ? undefined : { title: () => renderContent(title) }),
          ...(description === undefined
            ? undefined
            : { default: () => renderContent(description) }),
        },
      )
    }

    return () => {
      const config = options.ui?.toastProvider
      const position = props.position ?? config?.defaultVariants?.position ?? 'top-right'
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const viewport = h(
        ToastViewport,
        {
          ...attributes,
          hotkey: props.hotkey,
          label: props.viewportLabel,
          class: getToastViewportClasses({
            position,
            config,
            ui: props.ui,
            className,
          }),
          'data-mk-position': position,
        },
        { default: () => [] },
      )
      const renderedViewport =
        props.portal === false
          ? viewport
          : h(ToastPortal, props.portal === true ? undefined : { to: props.portal }, {
              default: () => viewport,
            })

      return h(
        ToastProvider as Component,
        {
          label: props.label,
          duration: props.duration,
          disableSwipe: props.disableSwipe,
          swipeDirection: props.swipeDirection,
          swipeThreshold: props.swipeThreshold,
          ...(props.limit === undefined ? undefined : { limit: props.limit }),
        },
        {
          default: (): VNodeChild[] => [
            slots.default?.(),
            ...toasts.value.map(renderManagedToast),
            renderedViewport,
          ],
        },
      )
    }
  },
})
