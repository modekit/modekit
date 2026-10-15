import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkButton } from '../button/MkButton.js'
import type { ButtonColor, ButtonVariant } from '../button/types.js'
import { dialogAnimations, dialogSizes } from '../dialog/types.js'
import {
  getAlertDialogClasses,
  getAlertDialogOverlayClasses,
  getAlertDialogSlotClasses,
} from './styles/index.js'
import type {
  AlertDialogAnimation,
  AlertDialogAs,
  AlertDialogPortalTarget,
  AlertDialogSize,
  AlertDialogSlots,
  AlertDialogUI,
} from './types.js'

export const MkAlertDialog = defineComponent({
  name: 'MkAlertDialog',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<AlertDialogAs>,
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
    unmountOnHide: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<AlertDialogSize>,
      default: undefined,
      validator: (value: AlertDialogSize) => dialogSizes.includes(value),
    },
    animation: {
      type: String as PropType<AlertDialogAnimation>,
      default: undefined,
      validator: (value: AlertDialogAnimation) => dialogAnimations.includes(value),
    },
    cancelLabel: {
      type: String,
      default: 'Cancel',
    },
    actionLabel: {
      type: String,
      default: 'Continue',
    },
    actionColor: {
      type: String as PropType<ButtonColor>,
      default: 'red',
    },
    actionVariant: {
      type: String as PropType<ButtonVariant>,
      default: 'default',
    },
    portal: {
      type: [Boolean, String, Object] as PropType<AlertDialogPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<AlertDialogUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    action: (event: MouseEvent) => event instanceof MouseEvent,
    cancel: (event: MouseEvent) => event instanceof MouseEvent,
    openAutoFocus: (event: Event) => event instanceof Event,
    closeAutoFocus: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<AlertDialogSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const config = options.ui?.alertDialog
      const size = props.size ?? config?.defaultVariants?.size ?? 'sm'
      const animation = props.animation ?? config?.defaultVariants?.animation ?? 'scale'
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const hasTitle = props.title !== undefined || slots.title !== undefined
      const hasDescription = props.description !== undefined || slots.description !== undefined
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        unmountOnHide: props.unmountOnHide,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(AlertDialogRoot, rootProps, {
        default: ({ open, close }: { open: boolean; close: () => void }): VNodeChild[] => {
          const slotProps = { open, close }
          const content = h(
            AlertDialogContent as Component,
            {
              ...attributes,
              as: props.as,
              class: getAlertDialogClasses({
                size,
                animation,
                config,
                ui: props.ui,
                className,
              }),
              'data-mk-size': size,
              'data-mk-animation': animation,
              onEscapeKeyDown: (event: Event) => {
                event.preventDefault()
              },
              onPointerDownOutside: (event: Event) => {
                event.preventDefault()
              },
              onFocusOutside: (event: Event) => {
                event.preventDefault()
              },
              onInteractOutside: (event: Event) => {
                event.preventDefault()
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
                hasTitle || hasDescription
                  ? h(
                      'div',
                      {
                        class: getAlertDialogSlotClasses({
                          slot: 'header',
                          config,
                          ui: props.ui,
                        }),
                      },
                      [
                        hasTitle
                          ? h(
                              AlertDialogTitle,
                              {
                                class: getAlertDialogSlotClasses({
                                  slot: 'title',
                                  config,
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
                              AlertDialogDescription,
                              {
                                class: getAlertDialogSlotClasses({
                                  slot: 'description',
                                  config,
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
                        class: getAlertDialogSlotClasses({
                          slot: 'body',
                          config,
                          ui: props.ui,
                        }),
                      },
                      [slots.content(slotProps)],
                    )
                  : undefined,
                h(
                  'div',
                  {
                    class: [
                      getAlertDialogSlotClasses({
                        slot: 'footer',
                        config,
                        ui: props.ui,
                      }),
                      slots.content ? undefined : 'mk:pt-6',
                    ],
                  },
                  [
                    h(
                      AlertDialogCancel,
                      {
                        asChild: true,
                        class: getAlertDialogSlotClasses({
                          slot: 'cancel',
                          config,
                          ui: props.ui,
                        }),
                        onClick: (event: MouseEvent) => {
                          emit('cancel', event)
                        },
                      },
                      {
                        default: () =>
                          slots.cancel?.(slotProps) ??
                          h(MkButton, { color: 'gray', variant: 'ghost' }, () => props.cancelLabel),
                      },
                    ),
                    h(
                      AlertDialogAction,
                      {
                        asChild: true,
                        class: getAlertDialogSlotClasses({
                          slot: 'action',
                          config,
                          ui: props.ui,
                        }),
                        onClick: (event: MouseEvent) => {
                          emit('action', event)
                        },
                      },
                      {
                        default: () =>
                          slots.action?.(slotProps) ??
                          h(
                            MkButton,
                            { color: props.actionColor, variant: props.actionVariant },
                            () => props.actionLabel,
                          ),
                      },
                    ),
                  ],
                ),
              ],
            },
          )
          const overlay = h(AlertDialogOverlay, {
            class: getAlertDialogOverlayClasses({ animation, config, ui: props.ui }),
          })
          const layer =
            props.portal === false
              ? [overlay, content]
              : h(AlertDialogPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => [overlay, content],
                })

          return [
            slots.default
              ? h(AlertDialogTrigger, { asChild: true }, { default: slots.default })
              : undefined,
            layer,
          ]
        },
      })
    }
  },
})
