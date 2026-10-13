import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getCardClasses, getCardSlotClasses } from './styles/index.js'
import { cardSizes, cardVariants } from './types.js'
import type { CardOptions, CardProps, CardSize, CardSlots, CardUI, CardVariant } from './types.js'

const runtimeProps = {
  variant: {
    type: String as PropType<CardVariant>,
    validator: (value: CardVariant) => cardVariants.includes(value),
  },
  size: {
    type: String as PropType<CardSize>,
    validator: (value: CardSize) => cardSizes.includes(value),
  },
  ui: {
    type: Object as PropType<CardUI>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<CardOptions>

export const MkCard: FunctionalComponent<CardProps, Record<string, never>, CardSlots> = (
  props,
  { attrs, slots },
) => {
  const options = useModeKitOptions()
  const cardConfig = options.ui?.card
  const variant = props.variant ?? cardConfig?.defaultVariants?.variant ?? 'shadow'
  const size = props.size ?? cardConfig?.defaultVariants?.size ?? 'md'
  const attributes: HTMLAttributes = attrs

  return h(
    Primitive,
    {
      ...attributes,
      as: 'div',
      class: getCardClasses({
        variant,
        size,
        config: cardConfig,
        ui: props.ui,
        className: attributes.class,
      }),
      'data-mk-variant': variant,
      'data-mk-size': size,
    },
    {
      default: () => [
        slots.header
          ? h(
              'div',
              {
                class: getCardSlotClasses({
                  slot: 'header',
                  config: cardConfig,
                  ui: props.ui,
                }),
              },
              [slots.header()],
            )
          : undefined,
        slots.default
          ? h(
              'div',
              {
                class: getCardSlotClasses({
                  slot: 'body',
                  config: cardConfig,
                  ui: props.ui,
                }),
              },
              [slots.default()],
            )
          : undefined,
        slots.footer
          ? h(
              'div',
              {
                class: getCardSlotClasses({
                  slot: 'footer',
                  config: cardConfig,
                  ui: props.ui,
                }),
              },
              [slots.footer()],
            )
          : undefined,
      ],
    },
  )
}

MkCard.props = runtimeProps
MkCard.displayName = 'MkCard'
