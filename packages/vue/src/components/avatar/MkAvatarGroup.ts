import { Primitive } from 'reka-ui'
import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  provide,
  Text,
} from 'vue'
import type { HTMLAttributes, PropType, SlotsType, VNode } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { avatarGroupContextKey } from './context.js'
import { MkAvatar } from './MkAvatar.js'
import { getAvatarGroupClasses, getAvatarGroupSlotClasses } from './styles/group.js'
import { avatarColors, avatarGroupSpacings, avatarSizes } from './types.js'
import type {
  AvatarColor,
  AvatarGroupAs,
  AvatarGroupSlots,
  AvatarGroupSpacing,
  AvatarGroupUI,
  AvatarSize,
} from './types.js'

function getDefaultOverflowLabel(count: number): string {
  return `${String(count)} more ${count === 1 ? 'member' : 'members'}`
}

function flattenAvatarChildren(children: readonly unknown[]): VNode[] {
  const result: VNode[] = []

  for (const child of children) {
    if (!isVNode(child) || child.type === Comment || child.type === Text) continue

    if (child.type === Fragment && Array.isArray(child.children)) {
      result.push(...flattenAvatarChildren(child.children))
      continue
    }

    result.push(child)
  }

  return result
}

export const MkAvatarGroup = defineComponent({
  name: 'MkAvatarGroup',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<AvatarGroupAs>,
      default: 'div',
    },
    size: {
      type: String as PropType<AvatarSize>,
      default: undefined,
      validator: (value: AvatarSize) => avatarSizes.includes(value),
    },
    spacing: {
      type: String as PropType<AvatarGroupSpacing>,
      default: undefined,
      validator: (value: AvatarGroupSpacing) => avatarGroupSpacings.includes(value),
    },
    max: {
      type: Number,
      default: undefined,
      validator: (value: number) => Number.isInteger(value) && value >= 0,
    },
    overflowColor: {
      type: String as PropType<AvatarColor>,
      default: undefined,
      validator: (value: AvatarColor) => avatarColors.includes(value),
    },
    overflowLabel: {
      type: String,
      default: undefined,
    },
    ui: {
      type: Object as PropType<AvatarGroupUI>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<AvatarGroupSlots>,
  setup(props, { attrs, slots }) {
    const options = useModeKitOptions()
    const size = computed(
      () => props.size ?? options.ui?.avatarGroup?.defaultVariants?.size ?? 'md',
    )

    provide(avatarGroupContextKey, { size })

    return () => {
      const avatarGroupConfig = options.ui?.avatarGroup
      const spacing = props.spacing ?? avatarGroupConfig?.defaultVariants?.spacing ?? 'normal'
      const overflowColor =
        props.overflowColor ?? avatarGroupConfig?.defaultVariants?.overflowColor ?? 'secondary'
      const attributes: HTMLAttributes = attrs
      const slotContent = slots.default?.()
      const children = flattenAvatarChildren(
        Array.isArray(slotContent) ? slotContent : [slotContent],
      )
      const visibleCount =
        props.max === undefined ? children.length : Math.min(props.max, children.length)
      const hiddenCount = children.length - visibleCount
      const itemClass = getAvatarGroupSlotClasses({
        slot: 'item',
        overflowColor,
        config: avatarGroupConfig,
        ui: props.ui,
      })
      const visibleChildren = children
        .slice(0, visibleCount)
        .map((child) => cloneVNode(child, { class: itemClass }))
      const overflowClass = getAvatarGroupSlotClasses({
        slot: 'overflow',
        overflowColor,
        config: avatarGroupConfig,
        ui: props.ui,
      })

      if (hiddenCount > 0) {
        visibleChildren.push(
          h(
            MkAvatar,
            {
              'aria-label': props.overflowLabel ?? getDefaultOverflowLabel(hiddenCount),
              color: overflowColor,
              class: [itemClass, overflowClass],
            },
            {
              default: () => slots.overflow?.({ count: hiddenCount }) ?? `+${String(hiddenCount)}`,
            },
          ),
        )
      }

      return h(
        Primitive,
        {
          ...attributes,
          as: props.as,
          role: attributes.role ?? 'group',
          class: getAvatarGroupClasses({
            size: size.value,
            spacing,
            config: avatarGroupConfig,
            ui: props.ui,
            className: attributes.class,
          }),
          'data-mk-size': size.value,
          'data-mk-spacing': spacing,
          'data-mk-max': props.max,
          'data-mk-overflow-count': hiddenCount > 0 ? hiddenCount : undefined,
        },
        {
          default: () => visibleChildren,
        },
      )
    }
  },
})
