import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  CSSProperties,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkGrid } from '../grid/MkGrid.js'
import { MkHeadline } from '../typography/MkHeadline.js'
import { MkText } from '../typography/MkText.js'
import { getCardClasses, getCardSlotClasses } from './styles/index.js'
import { cardBodyTreatments, cardSizes, cardVariants } from './types.js'
import type {
  CardBodyTreatment,
  CardOptions,
  CardProps,
  CardSize,
  CardSlots,
  CardUI,
  CardVariant,
} from './types.js'

const cardGaps = {
  sm: 'm',
  md: 'l',
  lg: 'xl',
} as const satisfies Record<CardSize, 'm' | 'l' | 'xl'>

const cardRootEdgeMetrics = {
  sm: { '--mk-card-root-padding': '1rem', '--mk-card-root-radius': '0.5rem' },
  md: { '--mk-card-root-padding': '1.5rem', '--mk-card-root-radius': '0.75rem' },
  lg: { '--mk-card-root-padding': '2rem', '--mk-card-root-radius': '1rem' },
} as const satisfies Record<CardSize, CSSProperties>

const cardPanelEdgePadding = {
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
} as const satisfies Record<CardSize, string>

const cardInsetEdgeRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
} as const satisfies Record<CardSize, string>

function getCardBodyEdgeMetrics(
  body: CardBodyTreatment,
  size: CardSize,
): CSSProperties | undefined {
  if (body === 'seamless') return undefined

  const padding = cardPanelEdgePadding[size]
  const radius =
    body === 'inset'
      ? cardInsetEdgeRadius[size]
      : cardRootEdgeMetrics[size]['--mk-card-root-radius']

  return {
    '--mk-card-edge-inline': padding,
    '--mk-card-edge-block-start': padding,
    '--mk-card-edge-block-end': padding,
    '--mk-card-edge-radius-start': radius,
    '--mk-card-edge-radius-end': radius,
  }
}

const runtimeProps = {
  body: {
    type: String as PropType<CardBodyTreatment>,
    validator: (value: CardBodyTreatment) => cardBodyTreatments.includes(value),
  },
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
  const body = props.body ?? cardConfig?.defaultVariants?.body ?? 'seamless'
  const variant = props.variant ?? cardConfig?.defaultVariants?.variant ?? 'shadow'
  const size = props.size ?? cardConfig?.defaultVariants?.size ?? 'md'
  const attributes: HTMLAttributes = attrs
  const hasHeaderContent =
    slots.header !== undefined || props.title !== undefined || props.description !== undefined
  const headerActions = slots['header-actions']
  const hasHeader = hasHeaderContent || headerActions !== undefined
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
    MkGrid,
    {
      ...attributes,
      align: 'stretch',
      as: 'div',
      columns: 1,
      display: 'grid',
      gap: cardGaps[size],
      style: [cardRootEdgeMetrics[size], attributes.style],
      class: getCardClasses({
        variant,
        size,
        config: cardConfig,
        ui: props.ui,
        className: attributes.class,
      }),
      'data-mk-body': body,
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
                  body,
                  size,
                  variant,
                  config: cardConfig,
                  ui: props.ui,
                }),
              },
              [
                hasHeaderContent
                  ? h(
                      'div',
                      {
                        class: getCardSlotClasses({
                          slot: 'headerContent',
                          body,
                          size,
                          variant,
                          config: cardConfig,
                          ui: props.ui,
                        }),
                      },
                      headerContent,
                    )
                  : undefined,
                headerActions !== undefined
                  ? h(
                      'div',
                      {
                        class: getCardSlotClasses({
                          slot: 'headerActions',
                          body,
                          size,
                          variant,
                          config: cardConfig,
                          ui: props.ui,
                        }),
                      },
                      [headerActions()],
                    )
                  : undefined,
              ],
            )
          : undefined,
        slots.default
          ? h(
              'div',
              {
                class: getCardSlotClasses({
                  slot: 'body',
                  body,
                  size,
                  variant,
                  config: cardConfig,
                  ui: props.ui,
                }),
                style: getCardBodyEdgeMetrics(body, size),
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
                  body,
                  size,
                  variant,
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
