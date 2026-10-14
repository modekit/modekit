import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'
import { useModeKitOptions } from '../../config/context.js'
import { getEllipsisTextClasses } from './styles/index.js'
import { ellipsisLines, textSizes, typographyAlignments, typographyWeights } from './types.js'
import type {
  EllipsisLines,
  EllipsisTextAs,
  EllipsisTextOptions,
  EllipsisTextProps,
  TextProps,
  TextSize,
  TypographyAlign,
  TypographySlots,
  TypographyUI,
  TypographyWeight,
} from './types.js'
import { MkText } from './MkText.js'

const runtimeProps = {
  as: { type: [String, Object, Function] as PropType<EllipsisTextAs>, default: 'span' },
  size: { type: String as PropType<TextSize>, validator: (v: TextSize) => textSizes.includes(v) },
  lines: {
    type: Number as PropType<EllipsisLines>,
    validator: (v: EllipsisLines) => ellipsisLines.includes(v),
  },
  primary: { type: Boolean, default: undefined },
  weight: {
    type: String as PropType<TypographyWeight>,
    validator: (v: TypographyWeight) => typographyWeights.includes(v),
  },
  align: {
    type: String as PropType<TypographyAlign>,
    validator: (v: TypographyAlign) => typographyAlignments.includes(v),
  },
  ui: { type: Object as PropType<TypographyUI>, default: undefined },
} satisfies ComponentObjectPropsOptions<EllipsisTextOptions>

export const MkEllipsisText: FunctionalComponent<
  EllipsisTextProps,
  Record<string, never>,
  TypographySlots
> = (props, { attrs, slots }) => {
  const config = useModeKitOptions().ui?.ellipsisText
  const lines = props.lines ?? config?.defaultVariants?.lines ?? 1
  const attributes: HTMLAttributes = attrs
  const textProps: TextProps & { 'data-mk-lines': EllipsisLines } = {
    ...attributes,
    as: props.as ?? 'span',
    ...(props.size === undefined ? {} : { size: props.size }),
    ...(props.primary === undefined ? {} : { primary: props.primary }),
    ...(props.weight === undefined ? {} : { weight: props.weight }),
    ...(props.align === undefined ? {} : { align: props.align }),
    class: getEllipsisTextClasses({ lines, config, ui: props.ui, className: attributes.class }),
    'data-mk-lines': lines,
  }
  return h(MkText, textProps, { default: () => slots.default?.() })
}
MkEllipsisText.props = runtimeProps
MkEllipsisText.displayName = 'MkEllipsisText'
