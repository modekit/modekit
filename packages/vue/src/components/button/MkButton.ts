import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ButtonHTMLAttributes,
  ComponentObjectPropsOptions,
  FunctionalComponent,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkSpinner } from '../spinner/MkSpinner.js'
import { getButtonClasses } from './styles/index.js'
import { buttonColors, buttonSizes, buttonTypes, buttonVariants } from './types.js'
import type {
  ButtonColor,
  ButtonOptions,
  ButtonProps,
  ButtonSize,
  ButtonSlots,
  ButtonType,
  ButtonUI,
  ButtonVariant,
} from './types.js'

const runtimeProps = {
  color: {
    type: String as PropType<ButtonColor>,
    validator: (value: ButtonColor) => buttonColors.includes(value),
  },
  variant: {
    type: String as PropType<ButtonVariant>,
    validator: (value: ButtonVariant) => buttonVariants.includes(value),
  },
  size: {
    type: String as PropType<ButtonSize>,
    validator: (value: ButtonSize) => buttonSizes.includes(value),
  },
  type: {
    type: String as PropType<ButtonType>,
    default: 'button',
    validator: (value: ButtonType) => buttonTypes.includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  ui: {
    type: Object as PropType<ButtonUI>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<ButtonOptions>

export const MkButton: FunctionalComponent<ButtonProps, Record<string, never>, ButtonSlots> = (
  props,
  { attrs, slots },
) => {
  const options = useModeKitOptions()
  const buttonConfig = options.ui?.button
  const color = props.color ?? buttonConfig?.defaultVariants?.color ?? 'primary'
  const variant = props.variant ?? buttonConfig?.defaultVariants?.variant ?? 'default'
  const size = props.size ?? buttonConfig?.defaultVariants?.size ?? 'md'
  const type = props.type ?? 'button'
  const disabled = props.disabled ?? false
  const loading = props.loading ?? false
  const attributes: ButtonHTMLAttributes = attrs

  return h(
    Primitive,
    {
      ...attributes,
      as: 'button',
      class: getButtonClasses({
        color,
        variant,
        size,
        config: buttonConfig,
        ui: props.ui,
        className: attributes.class,
      }),
      type,
      disabled: disabled || loading,
      'aria-busy': loading ? 'true' : attributes['aria-busy'],
      'data-mk-color': color,
      'data-mk-variant': variant,
      'data-mk-size': size,
      'data-mk-loading': loading ? '' : undefined,
    },
    {
      default: () => [
        slots.leading?.(),
        loading ? (slots.loader?.() ?? h(MkSpinner, { size, 'aria-hidden': 'true' })) : undefined,
        slots.default?.(),
        slots.trailing?.(),
      ],
    },
  )
}

MkButton.props = runtimeProps
MkButton.displayName = 'MkButton'
