import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getHoverCardArrowClasses, getHoverCardClasses } from './styles/index.js'
import { hoverCardAlignments, hoverCardPositionStrategies, hoverCardSides } from './types.js'
import type {
  HoverCardAlign,
  HoverCardAs,
  HoverCardCollisionPadding,
  HoverCardPortalTarget,
  HoverCardPositionStrategy,
  HoverCardSide,
  HoverCardSlots,
  HoverCardUI,
} from './types.js'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0
}

function isCollisionPadding(value: unknown): value is HoverCardCollisionPadding {
  return isFiniteNumber(value) || (typeof value === 'object' && value !== null)
}

export const MkHoverCard = defineComponent({
  name: 'MkHoverCard',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<HoverCardAs>,
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
    openDelay: {
      type: Number,
      default: 700,
      validator: isNonNegativeFiniteNumber,
    },
    closeDelay: {
      type: Number,
      default: 300,
      validator: isNonNegativeFiniteNumber,
    },
    enableTouch: {
      type: Boolean,
      default: false,
    },
    side: {
      type: String as PropType<HoverCardSide>,
      default: 'bottom',
      validator: (value: HoverCardSide) => hoverCardSides.includes(value),
    },
    align: {
      type: String as PropType<HoverCardAlign>,
      default: 'center',
      validator: (value: HoverCardAlign) => hoverCardAlignments.includes(value),
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
      type: [Number, Object] as PropType<HoverCardCollisionPadding>,
      default: 8,
      validator: isCollisionPadding,
    },
    hideWhenDetached: {
      type: Boolean,
      default: false,
    },
    positionStrategy: {
      type: String as PropType<HoverCardPositionStrategy>,
      default: 'fixed',
      validator: (value: HoverCardPositionStrategy) => hoverCardPositionStrategies.includes(value),
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<HoverCardPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<HoverCardUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
    focusOutside: (event: Event) => event instanceof Event,
    interactOutside: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<HoverCardSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const hoverCardConfig = options.ui?.hoverCard
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
        class: getHoverCardClasses({
          config: hoverCardConfig,
          ui: props.ui,
          className,
        }),
        'data-mk-side': props.side,
        'data-mk-align': props.align,
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
      }
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        openDelay: props.openDelay,
        closeDelay: props.closeDelay,
        enableTouch: props.enableTouch,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(HoverCardRoot, rootProps, {
        default: ({ open }: { open: boolean }): VNodeChild[] => {
          const content = h(HoverCardContent as Component, contentProps, {
            default: () => [
              slots.content?.({ open }),
              props.arrow
                ? h(
                    HoverCardArrow,
                    {
                      width: 12,
                      height: 6,
                      rounded: true,
                      class: getHoverCardArrowClasses({
                        config: hoverCardConfig,
                        ui: props.ui,
                      }),
                    },
                    slots.arrow ? { default: slots.arrow } : undefined,
                  )
                : undefined,
            ],
          })
          const overlay =
            props.portal === false
              ? content
              : h(HoverCardPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => content,
                })

          return [h(HoverCardTrigger, { asChild: true }, { default: slots.default }), overlay]
        },
      })
    }
  },
})
