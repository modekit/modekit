import { TooltipProvider } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { SlotsType } from 'vue'

import type { TooltipProviderSlots } from './types.js'

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export const MkTooltipProvider = defineComponent({
  name: 'MkTooltipProvider',
  props: {
    delayDuration: {
      type: Number,
      default: 700,
      validator: isNonNegativeFiniteNumber,
    },
    skipDelayDuration: {
      type: Number,
      default: 300,
      validator: isNonNegativeFiniteNumber,
    },
    disableHoverableContent: {
      type: Boolean,
      default: false,
    },
    disableClosingTrigger: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ignoreNonKeyboardFocus: {
      type: Boolean,
      default: false,
    },
  },
  slots: Object as SlotsType<TooltipProviderSlots>,
  setup(props, { slots }) {
    return () =>
      h(
        TooltipProvider,
        {
          delayDuration: props.delayDuration,
          skipDelayDuration: props.skipDelayDuration,
          disableHoverableContent: props.disableHoverableContent,
          disableClosingTrigger: props.disableClosingTrigger,
          disabled: props.disabled,
          ignoreNonKeyboardFocus: props.ignoreNonKeyboardFocus,
        },
        { default: slots.default },
      )
  },
})
