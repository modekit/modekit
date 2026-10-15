import {
  injectTooltipProviderContext,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getTooltipArrowClasses, getTooltipClasses } from './styles/index.js'
import { tooltipAlignments, tooltipPositionStrategies, tooltipSides } from './types.js'
import type {
  TooltipAlign,
  TooltipAs,
  TooltipCollisionPadding,
  TooltipPortalTarget,
  TooltipPositionStrategy,
  TooltipSide,
  TooltipSlots,
  TooltipUI,
} from './types.js'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0
}

function isCollisionPadding(value: unknown): value is TooltipCollisionPadding {
  return isFiniteNumber(value) || (typeof value === 'object' && value !== null)
}

export const MkTooltip = defineComponent({
  name: 'MkTooltip',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<TooltipAs>,
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
    delayDuration: {
      type: Number,
      default: undefined,
      validator: isNonNegativeFiniteNumber,
    },
    disableHoverableContent: {
      type: Boolean,
      default: undefined,
    },
    disableClosingTrigger: {
      type: Boolean,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    ignoreNonKeyboardFocus: {
      type: Boolean,
      default: undefined,
    },
    side: {
      type: String as PropType<TooltipSide>,
      default: 'top',
      validator: (value: TooltipSide) => tooltipSides.includes(value),
    },
    align: {
      type: String as PropType<TooltipAlign>,
      default: 'center',
      validator: (value: TooltipAlign) => tooltipAlignments.includes(value),
    },
    sideOffset: {
      type: Number,
      default: 6,
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
      type: [Number, Object] as PropType<TooltipCollisionPadding>,
      default: 8,
      validator: isCollisionPadding,
    },
    hideWhenDetached: {
      type: Boolean,
      default: false,
    },
    positionStrategy: {
      type: String as PropType<TooltipPositionStrategy>,
      default: 'fixed',
      validator: (value: TooltipPositionStrategy) => tooltipPositionStrategies.includes(value),
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<TooltipPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<TooltipUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<TooltipSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const providerContext = injectTooltipProviderContext(null)

    const renderTooltip = (): VNodeChild => {
      const tooltipConfig = options.ui?.tooltip
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
        class: getTooltipClasses({
          config: tooltipConfig,
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
      }
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open
      if (props.delayDuration !== undefined) rootProps.delayDuration = props.delayDuration
      if (props.disableHoverableContent !== undefined) {
        rootProps.disableHoverableContent = props.disableHoverableContent
      }
      if (props.disableClosingTrigger !== undefined) {
        rootProps.disableClosingTrigger = props.disableClosingTrigger
      }
      if (props.disabled !== undefined) rootProps.disabled = props.disabled
      if (props.ignoreNonKeyboardFocus !== undefined) {
        rootProps.ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus
      }

      return h(TooltipRoot, rootProps, {
        default: ({ open }: { open: boolean }): VNodeChild[] => {
          const content = h(TooltipContent as Component, contentProps, {
            default: () => [
              slots.content?.({ open }),
              props.arrow
                ? h(
                    TooltipArrow,
                    {
                      width: 12,
                      height: 6,
                      class: getTooltipArrowClasses({ config: tooltipConfig, ui: props.ui }),
                    },
                    slots.arrow ? { default: slots.arrow } : undefined,
                  )
                : undefined,
            ],
          })
          const overlay =
            props.portal === false
              ? content
              : h(TooltipPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => content,
                })

          return [h(TooltipTrigger, { asChild: true }, { default: slots.default }), overlay]
        },
      })
    }

    return () =>
      providerContext
        ? renderTooltip()
        : h(TooltipProvider, null, {
            default: renderTooltip,
          })
  },
})
