import { Primitive } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { HTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getFlexClasses } from './styles/index.js'
import {
  flexAlignments,
  flexContentAlignments,
  flexDirections,
  flexDisplays,
  flexJustifications,
  flexSelfAlignments,
  flexSpacePresets,
  flexWraps,
} from './types.js'
import type {
  FlexAlign,
  FlexAs,
  FlexBasis,
  FlexContentAlign,
  FlexDirection,
  FlexDisplay,
  FlexGap,
  FlexGapValue,
  FlexJustify,
  FlexSelfAlign,
  FlexShorthand,
  FlexSlots,
  FlexUI,
  FlexWrap,
} from './types.js'

const spacingValues = {
  '2xs': '0.125rem',
  xs: '0.25rem',
  s: '0.5rem',
  m: '0.75rem',
  l: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '2.5rem',
  '4xl': '3rem',
} satisfies Record<(typeof flexSpacePresets)[number], string>

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isFlexBasis(value: unknown): value is FlexBasis {
  return typeof value === 'string' || isNonNegativeNumber(value)
}

function isFlexGapValue(value: unknown): value is FlexGapValue {
  return (
    isNonNegativeNumber(value) ||
    (typeof value === 'string' &&
      flexSpacePresets.includes(value as (typeof flexSpacePresets)[number]))
  )
}

function isFlexGap(value: unknown): value is FlexGap {
  return (
    isFlexGapValue(value) ||
    (Array.isArray(value) &&
      value.length === 2 &&
      isFlexGapValue(value[0]) &&
      isFlexGapValue(value[1]))
  )
}

function isFlexGapTuple(
  value: FlexGap,
): value is readonly [row: FlexGapValue, column: FlexGapValue] {
  return Array.isArray(value)
}

function isFlexShorthand(value: unknown): value is FlexShorthand {
  return (
    value === 'initial' ||
    value === 'auto' ||
    value === 'none' ||
    isNonNegativeNumber(value) ||
    (Array.isArray(value) &&
      value.length === 3 &&
      isNonNegativeNumber(value[0]) &&
      isNonNegativeNumber(value[1]) &&
      isFlexBasis(value[2]))
  )
}

function resolveBasis(value: FlexBasis): string {
  if (typeof value === 'number') {
    return `${String(value)}px`
  }

  if (flexSpacePresets.includes(value as (typeof flexSpacePresets)[number])) {
    return spacingValues[value as (typeof flexSpacePresets)[number]]
  }

  return value
}

function resolveGap(value: FlexGapValue): string {
  return typeof value === 'number' ? `${String(value)}px` : spacingValues[value]
}

function resolveFlex(value: FlexShorthand): string {
  if (typeof value === 'number') {
    return `${String(value)} 1 0%`
  }

  if (typeof value === 'string') {
    return value
  }

  return `${String(value[0])} ${String(value[1])} ${resolveBasis(value[2])}`
}

export const MkFlex = defineComponent({
  name: 'MkFlex',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<FlexAlign>,
      default: undefined,
      validator: (value: FlexAlign) => flexAlignments.includes(value),
    },
    alignContent: {
      type: String as PropType<FlexContentAlign>,
      default: undefined,
      validator: (value: FlexContentAlign) => flexContentAlignments.includes(value),
    },
    alignSelf: {
      type: String as PropType<FlexSelfAlign>,
      default: undefined,
      validator: (value: FlexSelfAlign) => flexSelfAlignments.includes(value),
    },
    as: {
      type: [String, Object, Function] as PropType<FlexAs>,
      default: 'div',
    },
    direction: {
      type: String as PropType<FlexDirection>,
      default: undefined,
      validator: (value: FlexDirection) => flexDirections.includes(value),
    },
    display: {
      type: String as PropType<FlexDisplay>,
      default: undefined,
      validator: (value: FlexDisplay) => flexDisplays.includes(value),
    },
    flex: {
      type: [String, Number, Array] as PropType<FlexShorthand>,
      default: undefined,
      validator: isFlexShorthand,
    },
    flexBasis: {
      type: [String, Number] as PropType<FlexBasis>,
      default: undefined,
      validator: isFlexBasis,
    },
    flexGrow: {
      type: Number,
      default: undefined,
      validator: isNonNegativeNumber,
    },
    flexShrink: {
      type: Number,
      default: undefined,
      validator: isNonNegativeNumber,
    },
    gap: {
      type: [String, Number, Array] as PropType<FlexGap>,
      default: 0,
      validator: isFlexGap,
    },
    justify: {
      type: String as PropType<FlexJustify>,
      default: undefined,
      validator: (value: FlexJustify) => flexJustifications.includes(value),
    },
    order: {
      type: Number,
      default: undefined,
      validator: (value: number) => Number.isInteger(value),
    },
    ui: {
      type: Object as PropType<FlexUI>,
      default: undefined,
    },
    wrap: {
      type: String as PropType<FlexWrap>,
      default: undefined,
      validator: (value: FlexWrap) => flexWraps.includes(value),
    },
  },
  slots: Object as SlotsType<FlexSlots>,
  setup(props, { attrs, slots }) {
    const options = useModeKitOptions()

    return () => {
      const flexConfig = options.ui?.flex
      const align = props.align ?? flexConfig?.defaultVariants?.align ?? 'stretch'
      const alignContent =
        props.alignContent ?? flexConfig?.defaultVariants?.alignContent ?? 'stretch'
      const direction = props.direction ?? flexConfig?.defaultVariants?.direction ?? 'row'
      const display = props.display ?? flexConfig?.defaultVariants?.display ?? 'flex'
      const justify = props.justify ?? flexConfig?.defaultVariants?.justify ?? 'start'
      const wrap = props.wrap ?? flexConfig?.defaultVariants?.wrap ?? 'nowrap'
      const gap: FlexGap = props.gap
      const [rowGap, columnGap]: readonly [FlexGapValue, FlexGapValue] = isFlexGapTuple(gap)
        ? gap
        : [gap, gap]
      const { class: className, style: attributeStyle, ...attributes } = attrs as HTMLAttributes
      const flexItemStyle: Record<string, string | number> = {
        columnGap: resolveGap(columnGap),
        rowGap: resolveGap(rowGap),
      }

      if (props.alignSelf !== undefined) flexItemStyle.alignSelf = props.alignSelf
      if (props.flex !== undefined) flexItemStyle.flex = resolveFlex(props.flex)
      if (props.flexBasis !== undefined) flexItemStyle.flexBasis = resolveBasis(props.flexBasis)
      if (props.flexGrow !== undefined) flexItemStyle.flexGrow = props.flexGrow
      if (props.flexShrink !== undefined) flexItemStyle.flexShrink = props.flexShrink
      if (props.order !== undefined) flexItemStyle.order = props.order

      return h(
        Primitive,
        {
          ...attributes,
          as: props.as,
          class: getFlexClasses({
            align,
            alignContent,
            config: flexConfig,
            direction,
            display,
            justify,
            ui: props.ui,
            wrap,
            className,
          }),
          style: [flexItemStyle, attributeStyle],
          'data-mk-align': align,
          'data-mk-align-content': alignContent,
          'data-mk-direction': direction,
          'data-mk-display': display,
          'data-mk-justify': justify,
          'data-mk-wrap': wrap,
        },
        {
          default: () => slots.default?.(),
        },
      )
    }
  },
})
