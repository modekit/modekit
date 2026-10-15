import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getDialogClasses, getDialogOverlayClasses, getDialogSlotClasses } from './styles/index.js'
import { dialogAnimations, dialogSizes } from './types.js'
import type {
  DialogAnimation,
  DialogAs,
  DialogPortalTarget,
  DialogSize,
  DialogSlots,
  DialogUI,
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

export const MkDialog = defineComponent({
  name: 'MkDialog',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DialogAs>,
      default: 'div',
    },
    title: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: undefined,
    },
    open: {
      type: Boolean,
      default: undefined,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    unmountOnHide: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<DialogSize>,
      default: undefined,
      validator: (value: DialogSize) => dialogSizes.includes(value),
    },
    animation: {
      type: String as PropType<DialogAnimation>,
      default: undefined,
      validator: (value: DialogAnimation) => dialogAnimations.includes(value),
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    closeLabel: {
      type: String,
      default: 'Close dialog',
    },
    portal: {
      type: [Boolean, String, Object] as PropType<DialogPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<DialogUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
    focusOutside: (event: Event) => event instanceof Event,
    interactOutside: (event: Event) => event instanceof Event,
    openAutoFocus: (event: Event) => event instanceof Event,
    closeAutoFocus: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<DialogSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const dialogConfig = options.ui?.dialog
      const size = props.size ?? dialogConfig?.defaultVariants?.size ?? 'md'
      const animation = props.animation ?? dialogConfig?.defaultVariants?.animation ?? 'scale'
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const hasTitle = props.title !== undefined || slots.title !== undefined
      const hasDescription = props.description !== undefined || slots.description !== undefined
      const hasHeader = hasTitle || hasDescription
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        unmountOnHide: props.unmountOnHide,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(DialogRoot, rootProps, {
        default: ({ open, close }: { open: boolean; close: () => void }): VNodeChild[] => {
          const slotProps = { open, close }
          const content = h(
            DialogContent as Component,
            {
              ...attributes,
              as: props.as,
              class: getDialogClasses({
                size,
                animation,
                config: dialogConfig,
                ui: props.ui,
                className,
              }),
              'data-mk-size': size,
              'data-mk-animation': animation,
              onEscapeKeyDown: (event: KeyboardEvent) => {
                emit('escapeKeyDown', event)
                if (!props.dismissible) event.preventDefault()
              },
              onPointerDownOutside: (event: Event) => {
                emit('pointerDownOutside', event)
                if (!props.dismissible) event.preventDefault()
              },
              onFocusOutside: (event: Event) => {
                emit('focusOutside', event)
                if (!props.dismissible) event.preventDefault()
              },
              onInteractOutside: (event: Event) => {
                emit('interactOutside', event)
                if (!props.dismissible) event.preventDefault()
              },
              onOpenAutoFocus: (event: Event) => {
                emit('openAutoFocus', event)
              },
              onCloseAutoFocus: (event: Event) => {
                emit('closeAutoFocus', event)
              },
            },
            {
              default: () => [
                hasHeader
                  ? h(
                      'div',
                      {
                        class: getDialogSlotClasses({
                          slot: 'header',
                          config: dialogConfig,
                          ui: props.ui,
                        }),
                      },
                      [
                        hasTitle
                          ? h(
                              DialogTitle,
                              {
                                class: getDialogSlotClasses({
                                  slot: 'title',
                                  config: dialogConfig,
                                  ui: props.ui,
                                }),
                              },
                              {
                                default: () =>
                                  slots.title?.({ ...slotProps, title: props.title }) ??
                                  props.title,
                              },
                            )
                          : undefined,
                        hasDescription
                          ? h(
                              DialogDescription,
                              {
                                class: getDialogSlotClasses({
                                  slot: 'description',
                                  config: dialogConfig,
                                  ui: props.ui,
                                }),
                              },
                              {
                                default: () =>
                                  slots.description?.({
                                    ...slotProps,
                                    description: props.description,
                                  }) ?? props.description,
                              },
                            )
                          : undefined,
                      ],
                    )
                  : undefined,
                slots.content
                  ? h(
                      'div',
                      {
                        class: getDialogSlotClasses({
                          slot: 'body',
                          config: dialogConfig,
                          ui: props.ui,
                        }),
                      },
                      [slots.content(slotProps)],
                    )
                  : undefined,
                slots.footer
                  ? h(
                      'div',
                      {
                        class: getDialogSlotClasses({
                          slot: 'footer',
                          config: dialogConfig,
                          ui: props.ui,
                        }),
                      },
                      [slots.footer(slotProps)],
                    )
                  : undefined,
                props.closeButton
                  ? h(
                      DialogClose,
                      { asChild: true },
                      {
                        default: () =>
                          h(
                            'button',
                            {
                              'aria-label': props.closeLabel,
                              class: getDialogSlotClasses({
                                slot: 'close',
                                config: dialogConfig,
                                ui: props.ui,
                              }),
                              type: 'button',
                            },
                            [slots.close?.() ?? renderCloseIcon()],
                          ),
                      },
                    )
                  : undefined,
              ],
            },
          )
          const overlay = h(DialogOverlay, {
            class: getDialogOverlayClasses({
              animation,
              config: dialogConfig,
              ui: props.ui,
            }),
          })
          const layer =
            props.portal === false
              ? [overlay, content]
              : h(DialogPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => [overlay, content],
                })

          return [
            slots.default
              ? h(DialogTrigger, { asChild: true }, { default: slots.default })
              : undefined,
            layer,
          ]
        },
      })
    }
  },
})
