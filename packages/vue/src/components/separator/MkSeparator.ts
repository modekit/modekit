import { Separator as RekaSeparator } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
  VNode,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkText } from '../typography/MkText.js'
import { getSeparatorClasses, getSeparatorSlotClasses } from './styles/index.js'
import {
  separatorOrientations,
  separatorPositions,
  separatorSizes,
  separatorTypes,
} from './types.js'
import type {
  SeparatorAs,
  SeparatorOptions,
  SeparatorOrientation,
  SeparatorPosition,
  SeparatorProps,
  SeparatorSize,
  SeparatorSlots,
  SeparatorType,
  SeparatorUI,
} from './types.js'

const runtimeProps = {
  as: {
    type: [String, Object, Function] as PropType<SeparatorAs>,
    default: 'div',
  },
  label: {
    type: String,
    default: undefined,
  },
  primary: {
    type: Boolean,
    default: undefined,
  },
  size: {
    type: String as PropType<SeparatorSize>,
    validator: (value: SeparatorSize) => separatorSizes.includes(value),
  },
  type: {
    type: String as PropType<SeparatorType>,
    validator: (value: SeparatorType) => separatorTypes.includes(value),
  },
  orientation: {
    type: String as PropType<SeparatorOrientation>,
    validator: (value: SeparatorOrientation) => separatorOrientations.includes(value),
  },
  position: {
    type: String as PropType<SeparatorPosition>,
    validator: (value: SeparatorPosition) => separatorPositions.includes(value),
  },
  ui: {
    type: Object as PropType<SeparatorUI>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<SeparatorOptions>

type SeparatorLineOptions = Omit<Parameters<typeof getSeparatorSlotClasses>[0], 'slot'>

const labelSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
} as const

function renderLine(options: SeparatorLineOptions): VNode {
  return h('span', {
    'aria-hidden': 'true',
    class: getSeparatorSlotClasses({ ...options, slot: 'line' }),
  })
}

export const MkSeparator: FunctionalComponent<
  SeparatorProps,
  Record<string, never>,
  SeparatorSlots
> = (props, { attrs, slots }) => {
  const options = useModeKitOptions()
  const separatorConfig = options.ui?.separator
  const primary = props.primary ?? separatorConfig?.defaultVariants?.primary ?? false
  const size = props.size ?? separatorConfig?.defaultVariants?.size ?? 'sm'
  const type = props.type ?? separatorConfig?.defaultVariants?.type ?? 'solid'
  const orientation =
    props.orientation ?? separatorConfig?.defaultVariants?.orientation ?? 'horizontal'
  const position = props.position ?? separatorConfig?.defaultVariants?.position ?? 'center'
  const attributes: HTMLAttributes = attrs
  const hasContent = props.label !== undefined || slots.icon !== undefined
  const slotOptions = {
    primary,
    size,
    type,
    orientation,
    config: separatorConfig,
    ui: props.ui,
  } as const

  return h(
    RekaSeparator,
    {
      ...attributes,
      as: props.as ?? 'div',
      orientation,
      class: getSeparatorClasses({
        primary,
        size,
        type,
        orientation,
        position,
        config: separatorConfig,
        ui: props.ui,
        className: attributes.class,
      }),
      'aria-label': attributes['aria-label'] ?? props.label,
      'data-mk-orientation': orientation,
      'data-mk-position': position,
      'data-mk-primary': primary ? '' : undefined,
      'data-mk-size': size,
      'data-mk-type': type,
    },
    {
      default: () => {
        if (!hasContent) return renderLine(slotOptions)

        return [
          position === 'start' ? undefined : renderLine(slotOptions),
          h(
            'span',
            {
              class: getSeparatorSlotClasses({ ...slotOptions, slot: 'content' }),
            },
            [
              slots.icon
                ? h(
                    'span',
                    {
                      'aria-hidden': 'true',
                      class: getSeparatorSlotClasses({ ...slotOptions, slot: 'icon' }),
                    },
                    [slots.icon()],
                  )
                : undefined,
              props.label !== undefined
                ? h(
                    MkText,
                    {
                      class: getSeparatorSlotClasses({ ...slotOptions, slot: 'label' }),
                      primary,
                      size: labelSizes[size],
                      variant: 'label',
                      weight: 'medium',
                    },
                    { default: () => props.label },
                  )
                : undefined,
            ],
          ),
          position === 'end' ? undefined : renderLine(slotOptions),
        ]
      },
    },
  )
}

MkSeparator.props = runtimeProps
MkSeparator.displayName = 'MkSeparator'
