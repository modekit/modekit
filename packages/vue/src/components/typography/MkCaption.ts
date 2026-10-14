import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'
import { useModeKitOptions } from '../../config/context.js'
import { getCaptionClasses } from './styles/index.js'
import { captionSizes, captionVariants, typographyAlignments, typographyWeights } from './types.js'
import type {
  CaptionAs,
  CaptionOptions,
  CaptionProps,
  CaptionSize,
  CaptionVariant,
  TypographyAlign,
  TypographySlots,
  TypographyUI,
  TypographyWeight,
} from './types.js'

const runtimeProps = {
  as: { type: [String, Object, Function] as PropType<CaptionAs>, default: 'span' },
  size: {
    type: String as PropType<CaptionSize>,
    validator: (v: CaptionSize) => captionSizes.includes(v),
  },
  variant: {
    type: String as PropType<CaptionVariant>,
    validator: (v: CaptionVariant) => captionVariants.includes(v),
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
} satisfies ComponentObjectPropsOptions<CaptionOptions>

export const MkCaption: FunctionalComponent<
  CaptionProps,
  Record<string, never>,
  TypographySlots
> = (props, { attrs, slots }) => {
  const config = useModeKitOptions().ui?.caption
  const size = props.size ?? config?.defaultVariants?.size ?? 'sm'
  const variant = props.variant ?? config?.defaultVariants?.variant ?? 'default'
  const primary = props.primary ?? config?.defaultVariants?.primary ?? false
  const weight = props.weight ?? config?.defaultVariants?.weight ?? 'medium'
  const align = props.align ?? config?.defaultVariants?.align ?? 'inherit'
  const attributes: HTMLAttributes = attrs
  return h(
    Primitive,
    {
      ...attributes,
      as: props.as ?? 'span',
      class: getCaptionClasses({
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
MkCaption.props = runtimeProps
MkCaption.displayName = 'MkCaption'
