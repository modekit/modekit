import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'
import { useModeKitOptions } from '../../config/context.js'
import { getParagraphClasses } from './styles/index.js'
import { paragraphVariants, textSizes, typographyAlignments, typographyWeights } from './types.js'
import type {
  ParagraphAs,
  ParagraphOptions,
  ParagraphProps,
  ParagraphVariant,
  TextSize,
  TypographyAlign,
  TypographySlots,
  TypographyUI,
  TypographyWeight,
} from './types.js'

const runtimeProps = {
  as: { type: [String, Object, Function] as PropType<ParagraphAs>, default: 'p' },
  size: { type: String as PropType<TextSize>, validator: (v: TextSize) => textSizes.includes(v) },
  variant: {
    type: String as PropType<ParagraphVariant>,
    validator: (v: ParagraphVariant) => paragraphVariants.includes(v),
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
} satisfies ComponentObjectPropsOptions<ParagraphOptions>

export const MkParagraph: FunctionalComponent<
  ParagraphProps,
  Record<string, never>,
  TypographySlots
> = (props, { attrs, slots }) => {
  const config = useModeKitOptions().ui?.paragraph
  const size = props.size ?? config?.defaultVariants?.size ?? 'md'
  const variant = props.variant ?? config?.defaultVariants?.variant ?? 'default'
  const primary = props.primary ?? config?.defaultVariants?.primary ?? false
  const weight = props.weight ?? config?.defaultVariants?.weight ?? 'normal'
  const align = props.align ?? config?.defaultVariants?.align ?? 'inherit'
  const attributes: HTMLAttributes = attrs
  return h(
    Primitive,
    {
      ...attributes,
      as: props.as ?? 'p',
      class: getParagraphClasses({
        size,
        variant,
        primary,
        weight,
        align,
        config,
        ui: props.ui,
        className: attributes.class,
      }),
      'data-mk-size': size,
      'data-mk-variant': variant,
      'data-mk-primary': primary || undefined,
    },
    { default: () => slots.default?.() },
  )
}
MkParagraph.props = runtimeProps
MkParagraph.displayName = 'MkParagraph'
