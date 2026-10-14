import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkHeadline } from '../typography/MkHeadline.js'
import { MkText } from '../typography/MkText.js'
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
  title: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: undefined,
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
  const hasHeader =
    slots.header !== undefined || props.title !== undefined || props.description !== undefined
  const headerContent = slots.header
    ? [slots.header()]
    : [
        props.title !== undefined
          ? h(MkHeadline, { as: 'h3', size: 'xs' }, { default: () => props.title })
          : undefined,
        props.description !== undefined
          ? h(MkText, { as: 'p', size: 'sm' }, { default: () => props.description })
          : undefined,
      ]

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
        hasHeader
          ? h(
              'div',
              {
                class: getCardSlotClasses({
                  slot: 'header',
                  config: cardConfig,
                  ui: props.ui,
                }),
              },
              headerContent,
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
