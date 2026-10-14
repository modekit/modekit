import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  AnchorHTMLAttributes,
  ComponentObjectPropsOptions,
  FunctionalComponent,
  PropType,
} from 'vue'
import { useModeKitOptions } from '../../config/context.js'
import { getLinkClasses } from './styles/index.js'
import { inlineTextSizes, linkVariants, typographyWeights } from './types.js'
import type {
  InlineTextSize,
  LinkAs,
  LinkOptions,
  LinkProps,
  LinkVariant,
  TypographySlots,
  TypographyUI,
  TypographyWeight,
} from './types.js'

const runtimeProps = {
  as: { type: [String, Object, Function] as PropType<LinkAs>, default: 'a' },
  size: {
    type: String as PropType<InlineTextSize>,
    validator: (v: InlineTextSize) => inlineTextSizes.includes(v),
  },
  primary: { type: Boolean, default: undefined },
  weight: {
    type: String as PropType<TypographyWeight>,
    validator: (v: TypographyWeight) => typographyWeights.includes(v),
  },
  variant: {
    type: String as PropType<LinkVariant>,
    validator: (v: LinkVariant) => linkVariants.includes(v),
  },
  ui: { type: Object as PropType<TypographyUI>, default: undefined },
} satisfies ComponentObjectPropsOptions<LinkOptions>

export const MkLink: FunctionalComponent<LinkProps, Record<string, never>, TypographySlots> = (
  props,
  { attrs, slots },
) => {
  const config = useModeKitOptions().ui?.link
  const size = props.size ?? config?.defaultVariants?.size ?? 'inherit'
  const primary = props.primary ?? config?.defaultVariants?.primary ?? false
  const weight = props.weight ?? config?.defaultVariants?.weight ?? 'medium'
  const variant = props.variant ?? config?.defaultVariants?.variant ?? 'underline'
  const attributes: AnchorHTMLAttributes = attrs
  return h(
    Primitive,
    {
      ...attributes,
      as: props.as ?? 'a',
      class: getLinkClasses({
        size,
        primary,
        weight,
        variant,
        config,
        ui: props.ui,
        className: attributes.class,
      }),
      'data-mk-size': size,
      'data-mk-primary': primary || undefined,
      'data-mk-variant': variant,
    },
    { default: () => slots.default?.() },
  )
}
MkLink.props = runtimeProps
MkLink.displayName = 'MkLink'
