import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'reka-ui'
import type { DrawerOpenChangeDetails } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getSheetClasses, getSheetSlotClasses } from './styles/index.js'
import { sheetSides, sheetSizes, sheetVariants } from './types.js'
import type {
  SheetAs,
  SheetCloseReason,
  SheetPortalTarget,
  SheetSide,
  SheetSize,
  SheetSlots,
  SheetUI,
  SheetVariant,
} from './types.js'

const swipeDirections: Record<SheetSide, 'up' | 'right' | 'down' | 'left'> = {
  top: 'up',
  right: 'right',
  bottom: 'down',
  left: 'left',
}

const passiveCloseReasons = new Set<SheetCloseReason>(['swipe', 'escape-key', 'outside-press'])

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

/**
 * @alpha Built on Reka UI's alpha Drawer primitive. The Sheet API may change before stabilization.
 */
export const MkSheet = defineComponent({
  name: 'MkSheet',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<SheetAs>,
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
    side: {
      type: String as PropType<SheetSide>,
      default: undefined,
      validator: (value: SheetSide) => sheetSides.includes(value),
    },
    size: {
      type: String as PropType<SheetSize>,
      default: undefined,
      validator: (value: SheetSize) => sheetSizes.includes(value),
    },
    variant: {
      type: String as PropType<SheetVariant>,
      default: undefined,
      validator: (value: SheetVariant) => sheetVariants.includes(value),
    },
    handle: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    closeLabel: {
      type: String,
      default: 'Close sheet',
    },
    initialFocus: {
      type: [Boolean, Object] as PropType<boolean | HTMLElement | null>,
      default: true,
    },
    finalFocus: {
      type: [Boolean, Object] as PropType<boolean | HTMLElement | null>,
      default: true,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<SheetPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<SheetUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    afterOpen: () => true,
    afterClose: () => true,
    closePrevented: (reason: unknown): reason is SheetCloseReason | undefined =>
      reason === undefined ||
      (typeof reason === 'string' &&
        [
          'swipe',
          'escape-key',
          'outside-press',
          'click',
          'cancel',
          'trigger-press',
          'close-press',
        ].includes(reason)),
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
    focusOutside: (event: Event) => event instanceof Event,
    interactOutside: (event: Event) => event instanceof Event,
    openAutoFocus: (event: Event) => event instanceof Event,
    closeAutoFocus: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<SheetSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const sheetConfig = options.ui?.sheet
      const side = props.side ?? sheetConfig?.defaultVariants?.side ?? 'right'
      const size = props.size ?? sheetConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? sheetConfig?.defaultVariants?.variant ?? 'edge'
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const hasTitle = props.title !== undefined || slots.title !== undefined
      const hasDescription = props.description !== undefined || slots.description !== undefined
      const contentAttributes = { ...attributes }
      if (!hasDescription && !('aria-describedby' in contentAttributes)) {
        contentAttributes['aria-describedby'] = undefined
      }
      const hasHeader = hasTitle || hasDescription || slots.actions !== undefined
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        swipeDirection: swipeDirections[side],
        'onUpdate:openComplete': (value: boolean) => {
          if (value) emit('afterOpen')
          else emit('afterClose')
        },
        'onUpdate:open': (value: boolean, details: DrawerOpenChangeDetails) => {
          const reason = details.reason
          if (!props.dismissible && !value && reason && passiveCloseReasons.has(reason)) {
            details.cancel()
            emit('closePrevented', reason)
            return
          }
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(DrawerRoot, rootProps, {
        default: ({ open, close }: { open: boolean; close: () => void }): VNodeChild[] => {
          const slotProps = { open, close }
          const content = h(
            DrawerContent as Component,
            {
              ...contentAttributes,
              as: props.as,
              class: getSheetClasses({
                side,
                size,
                variant,
                config: sheetConfig,
                ui: props.ui,
                className,
              }),
              'data-mk-side': side,
              'data-mk-size': size,
              'data-mk-variant': variant,
              initialFocus: props.initialFocus,
              finalFocus: props.finalFocus,
              onEscapeKeyDown: (event: KeyboardEvent) => {
                emit('escapeKeyDown', event)
              },
              onPointerDownOutside: (event: Event) => {
                emit('pointerDownOutside', event)
              },
              onFocusOutside: (event: Event) => {
                emit('focusOutside', event)
              },
              onInteractOutside: (event: Event) => {
                emit('interactOutside', event)
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
                props.handle
                  ? h(DrawerHandle, {
                      class: getSheetSlotClasses({
                        slot: 'handle',
                        config: sheetConfig,
                        ui: props.ui,
                      }),
                      'data-side': side,
                    })
                  : undefined,
                h(
                  'div',
                  {
                    class: getSheetSlotClasses({
                      slot: 'container',
                      config: sheetConfig,
                      ui: props.ui,
                    }),
                  },
                  [
                    hasHeader
                      ? h(
                          'div',
                          {
                            class: getSheetSlotClasses({
                              slot: 'header',
                              config: sheetConfig,
                              ui: props.ui,
                            }),
                          },
                          [
                            hasTitle || hasDescription
                              ? h(
                                  'div',
                                  {
                                    class: getSheetSlotClasses({
                                      slot: 'wrapper',
                                      config: sheetConfig,
                                      ui: props.ui,
                                    }),
                                  },
                                  [
                                    hasTitle
                                      ? h(
                                          DrawerTitle,
                                          {
                                            class: getSheetSlotClasses({
                                              slot: 'title',
                                              config: sheetConfig,
                                              ui: props.ui,
                                            }),
                                          },
                                          {
                                            default: () =>
                                              slots.title?.({
                                                ...slotProps,
                                                title: props.title,
                                              }) ?? props.title,
                                          },
                                        )
                                      : undefined,
                                    hasDescription
                                      ? h(
                                          DrawerDescription,
                                          {
                                            class: getSheetSlotClasses({
                                              slot: 'description',
                                              config: sheetConfig,
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
                            slots.actions
                              ? h(
                                  'div',
                                  {
                                    class: getSheetSlotClasses({
                                      slot: 'actions',
                                      config: sheetConfig,
                                      ui: props.ui,
                                    }),
                                  },
                                  [slots.actions(slotProps)],
                                )
                              : undefined,
                          ],
                        )
                      : undefined,
                    slots.content
                      ? h(
                          'div',
                          {
                            class: getSheetSlotClasses({
                              slot: 'body',
                              config: sheetConfig,
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
                            class: getSheetSlotClasses({
                              slot: 'footer',
                              config: sheetConfig,
                              ui: props.ui,
                            }),
                          },
                          [slots.footer(slotProps)],
                        )
                      : undefined,
                  ],
                ),
                props.closeButton
                  ? h(
                      DrawerClose,
                      { asChild: true },
                      {
                        default: () =>
                          h(
                            'button',
                            {
                              'aria-label': props.closeLabel,
                              class: getSheetSlotClasses({
                                slot: 'close',
                                config: sheetConfig,
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
          const overlay = props.overlay
            ? h(DrawerOverlay, {
                class: getSheetSlotClasses({
                  slot: 'overlay',
                  config: sheetConfig,
                  ui: props.ui,
                }),
              })
            : undefined
          const layer =
            props.portal === false
              ? [overlay, content]
              : h(DrawerPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => [overlay, content],
                })

          return [
            slots.default
              ? h(DrawerTrigger, { asChild: true }, { default: slots.default })
              : undefined,
            layer,
          ]
        },
      })
    }
  },
})
