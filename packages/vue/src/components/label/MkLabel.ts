import { Label } from 'reka-ui'
import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  LabelHTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getLabelClasses, getLabelRequiredIndicatorClasses } from './styles/index.js'
import { labelSizes } from './types.js'
import type { LabelOptions, LabelProps, LabelSize, LabelSlots, LabelUI } from './types.js'

const runtimeProps = {
  for: {
    type: String,
    default: undefined,
  },
  size: {
    type: String as PropType<LabelSize>,
    validator: (value: LabelSize) => labelSizes.includes(value),
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ui: {
    type: Object as PropType<LabelUI>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<LabelOptions>

export const MkLabel: FunctionalComponent<LabelProps, Record<string, never>, LabelSlots> = (
  props,
  { attrs, slots },
) => {
  const options = useModeKitOptions()
  const labelConfig = options.ui?.label
  const size = props.size ?? labelConfig?.defaultVariants?.size ?? 'md'
  const attributes: LabelHTMLAttributes = attrs
  const labelProps: Record<string, unknown> = {
    ...attributes,
    class: getLabelClasses({
      size,
      config: labelConfig,
      ui: props.ui,
      className: attributes.class,
    }),
    'data-mk-size': size,
    'data-disabled': props.disabled ? '' : undefined,
    'data-required': props.required ? '' : undefined,
  }

  if (props.for !== undefined) labelProps.for = props.for

  return h(Label, labelProps, {
    default: () => [
      slots.default?.(),
      props.required
        ? h(
            'span',
            {
              'aria-hidden': 'true',
              class: getLabelRequiredIndicatorClasses({ config: labelConfig, ui: props.ui }),
            },
            '*',
          )
        : undefined,
    ],
  })
}

MkLabel.props = runtimeProps
MkLabel.displayName = 'MkLabel'
