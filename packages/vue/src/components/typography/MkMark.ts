import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'
import { useModeKitOptions } from '../../config/context.js'
import { getMarkClasses } from './styles/index.js'
import { inlineTextSizes, markVariants, typographyWeights } from './types.js'
import type {
  InlineTextSize,
  MarkAs,
  MarkOptions,
  MarkProps,
  MarkVariant,
  TextProps,
  TypographySlots,
  TypographyUI,
  TypographyWeight,
} from './types.js'
import { MkText } from './MkText.js'

const runtimeProps = {
  as: { type: [String, Object, Function] as PropType<MarkAs>, default: 'mark' },
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
    type: String as PropType<MarkVariant>,
    validator: (v: MarkVariant) => markVariants.includes(v),
  },
  ui: { type: Object as PropType<TypographyUI>, default: undefined },
} satisfies ComponentObjectPropsOptions<MarkOptions>

export const MkMark: FunctionalComponent<MarkProps, Record<string, never>, TypographySlots> = (
  props,
  { attrs, slots },
) => {
  const config = useModeKitOptions().ui?.mark
  const size = props.size ?? 'inherit'
  const primary = props.primary ?? config?.defaultVariants?.primary ?? false
  const variant = props.variant ?? config?.defaultVariants?.variant ?? 'soft'
  const attributes: HTMLAttributes = attrs
  const textProps: TextProps & {
    'data-mk-mark-size': InlineTextSize
    'data-mk-primary': true | undefined
    'data-mk-variant': MarkVariant
  } = {
    ...attributes,
    as: props.as ?? 'mark',
    ...(size === 'inherit' ? {} : { size }),
    primary,
    weight: props.weight ?? 'inherit',
    class: getMarkClasses({
      size,
      primary,
      variant,
      config,
      ui: props.ui,
      className: attributes.class,
    }),
    'data-mk-mark-size': size,
    'data-mk-primary': primary || undefined,
    'data-mk-variant': variant,
  }
  return h(MkText, textProps, { default: () => slots.default?.() })
}
MkMark.props = runtimeProps
MkMark.displayName = 'MkMark'
