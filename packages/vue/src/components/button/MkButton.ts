import { Primitive } from 'reka-ui'
import { h } from 'vue'
import type {
  ButtonHTMLAttributes,
  ComponentObjectPropsOptions,
  FunctionalComponent,
  PropType,
} from 'vue'

import { buttonTypes, buttonVariants } from './types.js'
import type { ButtonOptions, ButtonProps, ButtonSlots, ButtonType, ButtonVariant } from './types.js'

const runtimeProps = {
  variant: {
    type: String as PropType<ButtonVariant>,
    default: 'primary',
    validator: (value: ButtonVariant) => buttonVariants.includes(value),
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
} satisfies ComponentObjectPropsOptions<ButtonOptions>

export const MkButton: FunctionalComponent<ButtonProps, Record<string, never>, ButtonSlots> = (
  props,
  { attrs, slots },
) => {
  const { variant = 'primary', type = 'button', disabled = false, loading = false } = props
  const attributes: ButtonHTMLAttributes = attrs

  return h(
    Primitive,
    {
      ...attributes,
      as: 'button',
      class: ['mk-button', attributes.class],
      type,
      disabled: disabled || loading,
      'aria-busy': loading ? 'true' : attributes['aria-busy'],
      'data-mk-variant': variant,
      'data-mk-loading': loading ? '' : undefined,
    },
    {
      default: () => [
        slots.leading?.(),
        loading ? slots.loader?.() : undefined,
        slots.default?.(),
        slots.trailing?.(),
      ],
    },
  )
}

MkButton.props = runtimeProps
MkButton.displayName = 'MkButton'
