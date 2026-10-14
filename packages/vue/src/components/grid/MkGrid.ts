import { Primitive } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { HTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getGridClasses } from './styles/index.js'
import { gridAlignments, gridDisplays, gridSpacePresets } from './types.js'
import type {
  GridAlign,
  GridAs,
  GridDisplay,
  GridFlexBasis,
  GridFlexFactor,
  GridGap,
  GridGapValue,
  GridInset,
  GridLength,
  GridMargin,
  GridOverflow,
  GridPadding,
  GridPosition,
  GridSelfAlignment,
  GridSize,
  GridSlots,
  GridUI,
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
} satisfies Record<(typeof gridSpacePresets)[number], string>

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isGridGapValue(value: unknown): value is GridGapValue {
  return (
    isNonNegativeNumber(value) ||
    (typeof value === 'string' &&
      gridSpacePresets.includes(value as (typeof gridSpacePresets)[number]))
  )
}

function isGridGap(value: unknown): value is GridGap {
  return (
    isGridGapValue(value) ||
    (Array.isArray(value) &&
      value.length === 2 &&
      isGridGapValue(value[0]) &&
      isGridGapValue(value[1]))
  )
}

function isGridGapTuple(
  value: GridGap,
): value is readonly [row: GridGapValue, column: GridGapValue] {
  return Array.isArray(value)
}

function resolveLength(value: GridLength | GridInset | GridPadding | GridSize): string {
  if (typeof value === 'number') {
    return `${String(value)}px`
  }

  if (value === 'system') {
    return spacingValues.l
  }

  if (
    typeof value === 'string' &&
    gridSpacePresets.includes(value as (typeof gridSpacePresets)[number])
  ) {
    return spacingValues[value as (typeof gridSpacePresets)[number]]
  }

  return value
}

function resolveGap(value: GridGapValue): string {
  return typeof value === 'number' ? `${String(value)}px` : spacingValues[value]
}

function resolveMargin(value: GridMargin): string | undefined {
  if (value === 'none') {
    return '0px'
  }

  if (value === 'auto' || value === 'auto-inline' || value === 'auto-block') {
    return undefined
  }

  return resolveLength(value)
}

export const MkGrid = defineComponent({
  name: 'MkGrid',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<GridAlign>,
      default: undefined,
      validator: (value: GridAlign) => gridAlignments.includes(value),
    },
    alignSelf: {
      type: String as PropType<GridSelfAlignment>,
      default: undefined,
      validator: (value: GridSelfAlignment) => gridAlignments.includes(value),
    },
    as: {
      type: [String, Object, Function] as PropType<GridAs>,
      default: 'div',
    },
    blockSize: {
      type: [String, Number] as PropType<GridSize>,
      default: undefined,
    },
    columns: {
      type: Number,
      default: undefined,
      validator: (value: number) => Number.isInteger(value) && value > 0,
    },
    display: {
      type: String as PropType<GridDisplay>,
      default: undefined,
      validator: (value: GridDisplay) => gridDisplays.includes(value),
    },
    flexBasis: {
      type: [String, Number] as PropType<GridFlexBasis>,
      default: undefined,
    },
    flexGrow: {
      type: [String, Number] as PropType<GridFlexFactor>,
      default: undefined,
    },
    flexShrink: {
      type: [String, Number] as PropType<GridFlexFactor>,
      default: undefined,
    },
    gap: {
      type: [String, Number, Array] as PropType<GridGap>,
      default: 0,
      validator: isGridGap,
    },
    inlineSize: {
      type: [String, Number] as PropType<GridSize>,
      default: undefined,
    },
    inset: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    insetBlock: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    insetBlockEnd: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    insetBlockStart: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    insetInline: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    insetInlineEnd: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    insetInlineStart: {
      type: [String, Number] as PropType<GridInset>,
      default: undefined,
    },
    justifySelf: {
      type: String as PropType<GridSelfAlignment>,
      default: undefined,
      validator: (value: GridSelfAlignment) => gridAlignments.includes(value),
    },
    margin: {
      type: [String, Number] as PropType<GridMargin>,
      default: 'none',
    },
    marginBlock: {
      type: [String, Number] as PropType<GridLength>,
      default: undefined,
    },
    marginBlockEnd: {
      type: [String, Number] as PropType<GridLength>,
      default: undefined,
    },
    marginBlockStart: {
      type: [String, Number] as PropType<GridLength>,
      default: undefined,
    },
    marginInline: {
      type: [String, Number] as PropType<GridLength>,
      default: undefined,
    },
    marginInlineEnd: {
      type: [String, Number] as PropType<GridLength>,
      default: undefined,
    },
    marginInlineStart: {
      type: [String, Number] as PropType<GridLength>,
      default: undefined,
    },
    maxBlockSize: {
      type: [String, Number] as PropType<GridSize>,
      default: undefined,
    },
    maxInlineSize: {
      type: [String, Number] as PropType<Exclude<GridSize, 'auto'>>,
      default: undefined,
    },
    minBlockSize: {
      type: [String, Number] as PropType<GridSize>,
      default: undefined,
    },
    minColWidth: {
      type: Number,
      default: undefined,
      validator: (value: number) => Number.isFinite(value) && value > 0,
    },
    minInlineSize: {
      type: [String, Number] as PropType<Exclude<GridSize, 'auto'>>,
      default: undefined,
    },
    overflow: {
      type: String as PropType<GridOverflow>,
      default: undefined,
    },
    overflowBlock: {
      type: String as PropType<GridOverflow>,
      default: undefined,
    },
    overflowInline: {
      type: String as PropType<GridOverflow>,
      default: undefined,
    },
    padding: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    paddingBlock: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    paddingBlockEnd: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    paddingBlockStart: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    paddingInline: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    paddingInlineEnd: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    paddingInlineStart: {
      type: [String, Number] as PropType<GridPadding>,
      default: undefined,
    },
    position: {
      type: String as PropType<GridPosition>,
      default: undefined,
    },
    ui: {
      type: Object as PropType<GridUI>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<GridSlots>,
  setup(props, { attrs, slots }) {
    const options = useModeKitOptions()

    return () => {
      const gridConfig = options.ui?.grid
      const align = props.align ?? gridConfig?.defaultVariants?.align ?? 'stretch'
      const display = props.display ?? gridConfig?.defaultVariants?.display ?? 'grid'
      const columns = props.columns ?? 1
      const gap: GridGap = props.gap
      const [rowGap, columnGap]: readonly [GridGapValue, GridGapValue] = isGridGapTuple(gap)
        ? gap
        : [gap, gap]
      const { class: className, style: attributeStyle, ...attributes } = attrs as HTMLAttributes
      const style: Record<string, string | number | undefined> = {
        alignSelf: props.alignSelf,
        blockSize: props.blockSize === undefined ? undefined : resolveLength(props.blockSize),
        flexBasis: props.flexBasis === undefined ? undefined : resolveLength(props.flexBasis),
        flexGrow: props.flexGrow,
        flexShrink: props.flexShrink,
        gridTemplateColumns:
          props.minColWidth === undefined
            ? `repeat(${String(columns)}, minmax(0, 1fr))`
            : `repeat(auto-fit, minmax(${String(props.minColWidth)}px, 1fr))`,
        inlineSize: props.inlineSize === undefined ? undefined : resolveLength(props.inlineSize),
        inset: props.inset === undefined ? undefined : resolveLength(props.inset),
        insetBlock: props.insetBlock === undefined ? undefined : resolveLength(props.insetBlock),
        insetBlockEnd:
          props.insetBlockEnd === undefined ? undefined : resolveLength(props.insetBlockEnd),
        insetBlockStart:
          props.insetBlockStart === undefined ? undefined : resolveLength(props.insetBlockStart),
        insetInline: props.insetInline === undefined ? undefined : resolveLength(props.insetInline),
        insetInlineEnd:
          props.insetInlineEnd === undefined ? undefined : resolveLength(props.insetInlineEnd),
        insetInlineStart:
          props.insetInlineStart === undefined ? undefined : resolveLength(props.insetInlineStart),
        justifySelf: props.justifySelf,
        margin: resolveMargin(props.margin),
        marginBlock:
          props.margin === 'auto' || props.margin === 'auto-block'
            ? spacingValues.l
            : props.marginBlock === undefined
              ? undefined
              : resolveLength(props.marginBlock),
        marginBlockEnd:
          props.marginBlockEnd === undefined ? undefined : resolveLength(props.marginBlockEnd),
        marginBlockStart:
          props.marginBlockStart === undefined ? undefined : resolveLength(props.marginBlockStart),
        marginInline:
          props.margin === 'auto' || props.margin === 'auto-inline'
            ? spacingValues.l
            : props.marginInline === undefined
              ? undefined
              : resolveLength(props.marginInline),
        marginInlineEnd:
          props.marginInlineEnd === undefined ? undefined : resolveLength(props.marginInlineEnd),
        marginInlineStart:
          props.marginInlineStart === undefined
            ? undefined
            : resolveLength(props.marginInlineStart),
        maxBlockSize:
          props.maxBlockSize === undefined ? undefined : resolveLength(props.maxBlockSize),
        maxInlineSize:
          props.maxInlineSize === undefined ? undefined : resolveLength(props.maxInlineSize),
        minBlockSize:
          props.minBlockSize === undefined ? undefined : resolveLength(props.minBlockSize),
        minInlineSize:
          props.minInlineSize === undefined ? undefined : resolveLength(props.minInlineSize),
        overflow: props.overflow,
        overflowBlock: props.overflowBlock,
        overflowInline: props.overflowInline,
        padding: props.padding === undefined ? undefined : resolveLength(props.padding),
        paddingBlock:
          props.paddingBlock === undefined ? undefined : resolveLength(props.paddingBlock),
        paddingBlockEnd:
          props.paddingBlockEnd === undefined ? undefined : resolveLength(props.paddingBlockEnd),
        paddingBlockStart:
          props.paddingBlockStart === undefined
            ? undefined
            : resolveLength(props.paddingBlockStart),
        paddingInline:
          props.paddingInline === undefined ? undefined : resolveLength(props.paddingInline),
        paddingInlineEnd:
          props.paddingInlineEnd === undefined ? undefined : resolveLength(props.paddingInlineEnd),
        paddingInlineStart:
          props.paddingInlineStart === undefined
            ? undefined
            : resolveLength(props.paddingInlineStart),
        position: props.position,
        rowGap: resolveGap(rowGap),
        columnGap: resolveGap(columnGap),
      }

      return h(
        Primitive,
        {
          ...attributes,
          as: props.as,
          class: getGridClasses({
            align,
            config: gridConfig,
            display,
            ui: props.ui,
            className,
          }),
          style: [style, attributeStyle],
          'data-mk-align': align,
          'data-mk-columns': props.minColWidth === undefined ? columns : undefined,
          'data-mk-display': display,
          'data-mk-min-col-width': props.minColWidth,
        },
        {
          default: () => slots.default?.(),
        },
      )
    }
  },
})
