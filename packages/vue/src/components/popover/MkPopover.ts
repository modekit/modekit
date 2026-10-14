import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getPopoverArrowClasses, getPopoverClasses } from './styles/index.js'
import { popoverAlignments, popoverPositionStrategies, popoverSides } from './types.js'
import type {
  PopoverAlign,
  PopoverAs,
  PopoverCollisionPadding,
  PopoverPortalTarget,
  PopoverPositionStrategy,
  PopoverSide,
  PopoverSlots,
  PopoverUI,
} from './types.js'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isCollisionPadding(value: unknown): value is PopoverCollisionPadding {
  return isFiniteNumber(value) || (typeof value === 'object' && value !== null)
}

export const MkPopover = defineComponent({
  name: 'MkPopover',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<PopoverAs>,
      default: 'div',
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
      default: false,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    side: {
      type: String as PropType<PopoverSide>,
      default: 'bottom',
      validator: (value: PopoverSide) => popoverSides.includes(value),
    },
    align: {
      type: String as PropType<PopoverAlign>,
      default: 'center',
      validator: (value: PopoverAlign) => popoverAlignments.includes(value),
    },
    sideOffset: {
      type: Number,
      default: 8,
      validator: isFiniteNumber,
    },
    alignOffset: {
      type: Number,
      default: 0,
      validator: isFiniteNumber,
    },
    avoidCollisions: {
      type: Boolean,
      default: true,
    },
    collisionPadding: {
      type: [Number, Object] as PropType<PopoverCollisionPadding>,
      default: 8,
      validator: isCollisionPadding,
    },
    hideWhenDetached: {
      type: Boolean,
      default: false,
    },
    positionStrategy: {
      type: String as PropType<PopoverPositionStrategy>,
      default: 'fixed',
      validator: (value: PopoverPositionStrategy) => popoverPositionStrategies.includes(value),
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<PopoverPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<PopoverUI>,
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
  slots: Object as SlotsType<PopoverSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const popoverConfig = options.ui?.popover
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const contentProps = {
        ...attributes,
        as: props.as,
        side: props.side,
        align: props.align,
        sideOffset: props.sideOffset,
        alignOffset: props.alignOffset,
        avoidCollisions: props.avoidCollisions,
        collisionPadding: props.collisionPadding,
        hideWhenDetached: props.hideWhenDetached,
        positionStrategy: props.positionStrategy,
        class: getPopoverClasses({
          config: popoverConfig,
          ui: props.ui,
          className,
        }),
        'data-mk-side': props.side,
        'data-mk-align': props.align,
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
      }
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(PopoverRoot, rootProps, {
        default: ({ open, close }: { open: boolean; close: () => void }): VNodeChild[] => {
          const content = h(PopoverContent as Component, contentProps, {
            default: () => [
              slots.content?.({ open, close }),
              props.arrow
                ? h(
                    PopoverArrow,
                    {
                      width: 12,
                      height: 6,
                      rounded: true,
                      class: getPopoverArrowClasses({ config: popoverConfig, ui: props.ui }),
                    },
                    slots.arrow ? { default: slots.arrow } : undefined,
                  )
                : undefined,
            ],
          })
          const overlay =
            props.portal === false
              ? content
              : h(PopoverPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => content,
                })

          return [h(PopoverTrigger, { asChild: true }, { default: slots.default }), overlay]
        },
      })
    }
  },
})
