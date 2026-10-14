import { Primitive } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { HTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getCardEdgeClasses } from './styles/index.js'
import type { CardEdgeAs, CardEdgeSlots, CardEdgeUI } from './types.js'

export const MkCardEdge = defineComponent({
  name: 'MkCardEdge',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<CardEdgeAs>,
      default: 'div',
    },
    ui: {
      type: Object as PropType<CardEdgeUI>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<CardEdgeSlots>,
  setup(props, { attrs, slots }) {
    const options = useModeKitOptions()

    return () => {
      const attributes: HTMLAttributes = attrs

      return h(
        Primitive,
        {
          ...attributes,
          as: props.as,
          class: getCardEdgeClasses({
            config: options.ui?.cardEdge,
            ui: props.ui,
            className: attributes.class,
          }),
        },
        {
          default: () => slots.default?.(),
        },
      )
    }
  },
})
