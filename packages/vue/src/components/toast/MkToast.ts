import { ToastAction, ToastClose, ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getToastClasses, getToastSlotClasses } from './styles/index.js'
import { toastColors, toastTypes, toastVariants } from './types.js'
import type {
  ToastActionData,
  ToastAs,
  ToastColor,
  ToastContent,
  ToastSlots,
  ToastSwipeEvent,
  ToastType,
  ToastUI,
  ToastVariant,
} from './types.js'

function renderCloseIcon(): VNodeChild {
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      fill: 'none',
      viewBox: '0 0 16 16',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-width': '1.75',
    },
    [h('path', { d: 'm4 4 8 8m0-8-8 8' })],
  )
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function renderContent(content: ToastContent): VNodeChild {
  return typeof content === 'function' ? content() : content
}

export const MkToast = defineComponent({
  name: 'MkToast',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<ToastAs>,
      default: 'li',
    },
    open: {
      type: Boolean,
      default: undefined,
    },
    defaultOpen: {
      type: Boolean,
      default: true,
    },
    forceMount: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: undefined,
      validator: isNonNegativeFiniteNumber,
    },
    type: {
      type: String as PropType<ToastType>,
      default: 'foreground',
      validator: (value: ToastType) => toastTypes.includes(value),
    },
    color: {
      type: String as PropType<ToastColor>,
      default: undefined,
      validator: (value: ToastColor) => toastColors.includes(value),
    },
    variant: {
      type: String as PropType<ToastVariant>,
      default: undefined,
      validator: (value: ToastVariant) => toastVariants.includes(value),
    },
    title: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: undefined,
    },
    actions: {
      type: Array as PropType<readonly ToastActionData[]>,
      default: undefined,
    },
    actionAltText: {
      type: String,
      default: undefined,
    },
    actionCloseOnClick: {
      type: Boolean,
      default: true,
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    closeLabel: {
      type: String,
      default: 'Dismiss notification',
    },
    ui: {
      type: Object as PropType<ToastUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    action: (event: unknown): event is MouseEvent => event instanceof MouseEvent,
    escapeKeyDown: (event: unknown): event is KeyboardEvent => event instanceof KeyboardEvent,
    pause: () => true,
    resume: () => true,
    swipeStart: (event: unknown): event is ToastSwipeEvent => event instanceof CustomEvent,
    swipeMove: (event: unknown): event is ToastSwipeEvent => event instanceof CustomEvent,
    swipeCancel: (event: unknown): event is ToastSwipeEvent => event instanceof CustomEvent,
    swipeEnd: (event: unknown): event is ToastSwipeEvent => event instanceof CustomEvent,
  },
  slots: Object as SlotsType<ToastSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const config = options.ui?.toast
      const color = props.color ?? config?.defaultVariants?.color ?? 'neutral'
      const variant = props.variant ?? config?.defaultVariants?.variant ?? 'solid'
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const rootProps: Record<string, unknown> = {
        ...attributes,
        as: props.as,
        defaultOpen: props.defaultOpen,
        forceMount: props.forceMount,
        duration: props.duration,
        type: props.type,
        class: getToastClasses({ color, variant, config, ui: props.ui, className }),
        'data-mk-color': color,
        'data-mk-variant': variant,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
        onEscapeKeyDown: (event: KeyboardEvent) => {
          emit('escapeKeyDown', event)
        },
        onPause: () => {
          emit('pause')
        },
        onResume: () => {
          emit('resume')
        },
        onSwipeStart: (event: ToastSwipeEvent) => {
          emit('swipeStart', event)
        },
        onSwipeMove: (event: ToastSwipeEvent) => {
          emit('swipeMove', event)
        },
        onSwipeCancel: (event: ToastSwipeEvent) => {
          emit('swipeCancel', event)
        },
        onSwipeEnd: (event: ToastSwipeEvent) => {
          emit('swipeEnd', event)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(ToastRoot as Component, rootProps, {
        default: ({
          open,
          remaining,
          duration,
        }: {
          open: boolean
          remaining: number
          duration: number
        }) => {
          const slotProps = { open, remaining, duration }
          const hasTitle = props.title !== undefined || slots.title !== undefined
          const hasDescription = props.description !== undefined || slots.default !== undefined
          const actionNodes = [
            ...(props.actions ?? []).map((action, index) =>
              h(
                ToastAction as Component,
                {
                  key: index,
                  altText: action.altText,
                  closeOnClick: action.closeOnClick ?? true,
                  class: getToastSlotClasses({ slot: 'action', config, ui: props.ui }),
                  onClick: (event: MouseEvent) => {
                    action.onClick?.(event)
                    emit('action', event)
                  },
                },
                { default: () => renderContent(action.label) },
              ),
            ),
            ...(slots.action
              ? [
                  h(
                    ToastAction as Component,
                    {
                      ...(props.actionAltText === undefined
                        ? undefined
                        : { altText: props.actionAltText }),
                      closeOnClick: props.actionCloseOnClick,
                      class: getToastSlotClasses({ slot: 'action', config, ui: props.ui }),
                      onClick: (event: MouseEvent) => {
                        emit('action', event)
                      },
                    },
                    {
                      default: () =>
                        slots.action?.({ ...slotProps, altText: props.actionAltText ?? '' }),
                    },
                  ),
                ]
              : []),
          ]
          const actions =
            actionNodes.length > 0
              ? h('div', { class: 'mk-toast__actions mk:flex mk:flex-wrap mk:gap-2' }, actionNodes)
              : undefined
          const hasContent = hasTitle || hasDescription || actions !== undefined
          const icon = slots.icon
            ? h(
                'div',
                {
                  'aria-hidden': 'true',
                  class: getToastSlotClasses({ slot: 'icon', config, ui: props.ui }),
                },
                [slots.icon(slotProps)],
              )
            : undefined
          const content = hasContent
            ? h(
                'div',
                {
                  class: getToastSlotClasses({ slot: 'content', config, ui: props.ui }),
                },
                [
                  hasTitle
                    ? h(
                        ToastTitle,
                        {
                          class: getToastSlotClasses({
                            slot: 'title',
                            config,
                            ui: props.ui,
                          }),
                        },
                        {
                          default: () =>
                            slots.title?.({ ...slotProps, title: props.title }) ?? props.title,
                        },
                      )
                    : undefined,
                  hasDescription
                    ? h(
                        ToastDescription,
                        {
                          class: getToastSlotClasses({
                            slot: 'description',
                            config,
                            ui: props.ui,
                          }),
                        },
                        {
                          default: () =>
                            slots.default?.({
                              ...slotProps,
                              description: props.description,
                            }) ?? props.description,
                        },
                      )
                    : undefined,
                  actions,
                ],
              )
            : undefined
          const body =
            icon || content
              ? h(
                  'div',
                  {
                    class: getToastSlotClasses({ slot: 'body', config, ui: props.ui }),
                  },
                  [icon, content],
                )
              : undefined

          return [
            body,
            props.closeButton
              ? h(
                  ToastClose,
                  {
                    'aria-label': props.closeLabel,
                    class: getToastSlotClasses({ slot: 'close', config, ui: props.ui }),
                  },
                  {
                    default: () =>
                      slots.close?.({ ...slotProps, label: props.closeLabel }) ?? renderCloseIcon(),
                  },
                )
              : undefined,
          ]
        },
      })
    }
  },
})
