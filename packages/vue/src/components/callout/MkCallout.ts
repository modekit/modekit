import { Primitive } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getCalloutClasses, getCalloutSlotClasses } from './styles/index.js'
import { calloutColors, calloutSizes, calloutVariants } from './types.js'
import type {
  CalloutAs,
  CalloutColor,
  CalloutSize,
  CalloutSlots,
  CalloutUI,
  CalloutVariant,
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

export const MkCallout = defineComponent({
  name: 'MkCallout',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<CalloutAs>,
      default: 'div',
    },
    color: {
      type: String as PropType<CalloutColor>,
      default: undefined,
      validator: (value: CalloutColor) => calloutColors.includes(value),
    },
    variant: {
      type: String as PropType<CalloutVariant>,
      default: undefined,
      validator: (value: CalloutVariant) => calloutVariants.includes(value),
    },
    size: {
      type: String as PropType<CalloutSize>,
      default: undefined,
      validator: (value: CalloutSize) => calloutSizes.includes(value),
    },
    title: {
      type: String,
      default: undefined,
    },
    dismissible: {
      type: Boolean,
      default: false,
    },
    dismissLabel: {
      type: String,
      default: 'Dismiss callout',
    },
    ui: {
      type: Object as PropType<CalloutUI>,
      default: undefined,
    },
  },
  emits: {
    close: (event: unknown): event is MouseEvent => event instanceof MouseEvent,
  },
  slots: Object as SlotsType<CalloutSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const calloutConfig = options.ui?.callout
      const color = props.color ?? calloutConfig?.defaultVariants?.color ?? 'info'
      const variant = props.variant ?? calloutConfig?.defaultVariants?.variant ?? 'soft'
      const size = props.size ?? calloutConfig?.defaultVariants?.size ?? 'md'
      const attributes: HTMLAttributes = attrs
      const hasTitle = props.title !== undefined || slots.title !== undefined
      const hasContent = hasTitle || slots.default !== undefined || slots.actions !== undefined

      return h(
        Primitive,
        {
          ...attributes,
          as: props.as,
          class: getCalloutClasses({
            color,
            variant,
            size,
            config: calloutConfig,
            ui: props.ui,
            className: attributes.class,
          }),
          'data-mk-color': color,
          'data-mk-variant': variant,
          'data-mk-size': size,
          'data-mk-dismissible': props.dismissible ? '' : undefined,
        },
        {
          default: () => [
            slots.icon
              ? h(
                  'div',
                  {
                    'aria-hidden': 'true',
                    class: getCalloutSlotClasses({
                      slot: 'icon',
                      size,
                      config: calloutConfig,
                      ui: props.ui,
                    }),
                  },
                  [slots.icon()],
                )
              : undefined,
            hasContent
              ? h(
                  'div',
                  {
                    class: getCalloutSlotClasses({
                      slot: 'content',
                      size,
                      config: calloutConfig,
                      ui: props.ui,
                    }),
                  },
                  [
                    hasTitle
                      ? h(
                          'div',
                          {
                            class: getCalloutSlotClasses({
                              slot: 'title',
                              size,
                              config: calloutConfig,
                              ui: props.ui,
                            }),
                          },
                          [slots.title?.({ title: props.title }) ?? props.title],
                        )
                      : undefined,
                    slots.default
                      ? h(
                          'div',
                          {
                            class: getCalloutSlotClasses({
                              slot: 'description',
                              size,
                              config: calloutConfig,
                              ui: props.ui,
                            }),
                          },
                          [slots.default()],
                        )
                      : undefined,
                    slots.actions
                      ? h(
                          'div',
                          {
                            class: getCalloutSlotClasses({
                              slot: 'actions',
                              size,
                              config: calloutConfig,
                              ui: props.ui,
                            }),
                          },
                          [slots.actions()],
                        )
                      : undefined,
                  ],
                )
              : undefined,
            props.dismissible
              ? h(
                  'button',
                  {
                    type: 'button',
                    class: getCalloutSlotClasses({
                      slot: 'close',
                      size,
                      config: calloutConfig,
                      ui: props.ui,
                    }),
                    'aria-label': props.dismissLabel,
                    onClick: (event: MouseEvent) => {
                      emit('close', event)
                    },
                  },
                  [slots.close?.({ label: props.dismissLabel }) ?? renderCloseIcon()],
                )
              : undefined,
          ],
        },
      )
    }
  },
})
