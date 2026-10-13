import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getBadgeClasses } from './styles/index.js'
import { badgeColors, badgeSizes, badgeVariants } from './types.js'
import type {
  BadgeAs,
  BadgeColor,
  BadgeOptions,
  BadgeProps,
  BadgeSize,
  BadgeSlots,
  BadgeUI,
  BadgeVariant,
} from './types.js'

const runtimeProps = {
  as: {
    type: [String, Object, Function] as PropType<BadgeAs>,
    default: 'span',
  },
  color: {
    type: String as PropType<BadgeColor>,
    validator: (value: BadgeColor) => badgeColors.includes(value),
  },
  variant: {
    type: String as PropType<BadgeVariant>,
    validator: (value: BadgeVariant) => badgeVariants.includes(value),
  },
  size: {
    type: String as PropType<BadgeSize>,
    validator: (value: BadgeSize) => badgeSizes.includes(value),
  },
  rounded: {
    type: Boolean,
    default: undefined,
  },
  ui: {
    type: Object as PropType<BadgeUI>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<BadgeOptions>

export const MkBadge: FunctionalComponent<BadgeProps, Record<string, never>, BadgeSlots> = (
  props,
  { attrs, slots },
) => {
  const options = useModeKitOptions()
  const badgeConfig = options.ui?.badge
  const color = props.color ?? badgeConfig?.defaultVariants?.color ?? 'primary'
  const variant = props.variant ?? badgeConfig?.defaultVariants?.variant ?? 'default'
  const size = props.size ?? badgeConfig?.defaultVariants?.size ?? 'md'
  const rounded = props.rounded ?? badgeConfig?.defaultVariants?.rounded ?? false
  const attributes: HTMLAttributes = attrs

  return h(
    Primitive,
    {
      ...attributes,
      as: props.as ?? 'span',
      class: getBadgeClasses({
        color,
        variant,
        size,
        rounded,
        config: badgeConfig,
        ui: props.ui,
        className: attributes.class,
      }),
      'data-mk-color': color,
      'data-mk-variant': variant,
      'data-mk-size': size,
      'data-mk-rounded': rounded ? '' : undefined,
    },
    {
      default: () => [slots.leading?.(), slots.default?.(), slots.trailing?.()],
    },
  )
}

MkBadge.props = runtimeProps
MkBadge.displayName = 'MkBadge'
