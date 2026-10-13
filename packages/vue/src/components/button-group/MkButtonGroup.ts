import { Primitive } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { HTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getButtonGroupClasses } from './styles/index.js'
import { buttonGroupOrientations } from './types.js'
import type {
  ButtonGroupAs,
  ButtonGroupOrientation,
  ButtonGroupSlots,
  ButtonGroupUI,
} from './types.js'

export const MkButtonGroup = defineComponent({
  name: 'MkButtonGroup',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<ButtonGroupAs>,
      default: 'div',
    },
    orientation: {
      type: String as PropType<ButtonGroupOrientation>,
      default: undefined,
      validator: (value: ButtonGroupOrientation) => buttonGroupOrientations.includes(value),
    },
    ui: {
      type: Object as PropType<ButtonGroupUI>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<ButtonGroupSlots>,
  setup(props, { attrs, slots }) {
    const options = useModeKitOptions()

    return () => {
      const buttonGroupConfig = options.ui?.buttonGroup
      const orientation =
        props.orientation ?? buttonGroupConfig?.defaultVariants?.orientation ?? 'horizontal'
      const attributes: HTMLAttributes = attrs

      return h(
        Primitive,
        {
          ...attributes,
          as: props.as,
          role: attributes.role ?? 'group',
          class: getButtonGroupClasses({
            orientation,
            config: buttonGroupConfig,
            ui: props.ui,
            className: attributes.class,
          }),
          'data-mk-orientation': orientation,
        },
        {
          default: () => slots.default?.(),
        },
      )
    }
  },
})
