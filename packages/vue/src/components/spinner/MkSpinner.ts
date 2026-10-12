import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getSpinnerClasses } from './styles/index.js'
import { spinnerSizes } from './types.js'
import type { SpinnerOptions, SpinnerProps, SpinnerSize } from './types.js'

const runtimeProps = {
  size: {
    type: String as PropType<SpinnerSize>,
    validator: (value: SpinnerSize) => spinnerSizes.includes(value),
  },
  ui: {
    type: Object as PropType<SpinnerOptions['ui']>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<SpinnerOptions>

export const MkSpinner: FunctionalComponent<SpinnerProps> = (props, { attrs }) => {
  const options = useModeKitOptions()
  const spinnerConfig = options.ui?.spinner
  const size = props.size ?? spinnerConfig?.defaultVariants?.size ?? 'md'
  const attributes: HTMLAttributes = attrs
  const ariaHidden = attributes['aria-hidden'] === true || attributes['aria-hidden'] === 'true'

  return h('span', {
    ...attributes,
    class: getSpinnerClasses({
      size,
      config: spinnerConfig,
      ui: props.ui,
      className: attributes.class,
    }),
    role: ariaHidden ? undefined : (attributes.role ?? 'status'),
    'aria-label': ariaHidden ? undefined : (attributes['aria-label'] ?? 'Loading'),
    'data-mk-size': size,
  })
}

MkSpinner.props = runtimeProps
MkSpinner.displayName = 'MkSpinner'
