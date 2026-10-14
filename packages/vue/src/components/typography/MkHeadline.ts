import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'
import { useModeKitOptions } from '../../config/context.js'
import { getHeadlineClasses } from './styles/index.js'
import {
  headlineSizes,
  headlineVariants,
  typographyAlignments,
  typographyWeights,
} from './types.js'
import type {
  HeadlineAs,
  HeadlineOptions,
  HeadlineProps,
  HeadlineSize,
  HeadlineVariant,
  TypographyAlign,
  TypographySlots,
  TypographyUI,
  TypographyWeight,
} from './types.js'

const runtimeProps = {
  as: { type: [String, Object, Function] as PropType<HeadlineAs>, default: 'h2' },
  size: {
    type: String as PropType<HeadlineSize>,
    validator: (v: HeadlineSize) => headlineSizes.includes(v),
  },
  variant: {
    type: String as PropType<HeadlineVariant>,
    validator: (v: HeadlineVariant) => headlineVariants.includes(v),
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
} satisfies ComponentObjectPropsOptions<HeadlineOptions>

export const MkHeadline: FunctionalComponent<
  HeadlineProps,
  Record<string, never>,
  TypographySlots
> = (props, { attrs, slots }) => {
  const config = useModeKitOptions().ui?.headline
  const size = props.size ?? config?.defaultVariants?.size ?? 'md'
  const variant = props.variant ?? config?.defaultVariants?.variant ?? 'default'
  const primary = props.primary ?? config?.defaultVariants?.primary ?? false
  const weight = props.weight ?? config?.defaultVariants?.weight ?? 'bold'
  const align = props.align ?? config?.defaultVariants?.align ?? 'inherit'
  const attributes: HTMLAttributes = attrs
  return h(
    Primitive,
    {
      ...attributes,
      as: props.as ?? 'h2',
      class: getHeadlineClasses({
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
MkHeadline.props = runtimeProps
MkHeadline.displayName = 'MkHeadline'
