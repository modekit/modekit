import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { defineComponent, h, inject } from 'vue'
import type { HTMLAttributes, PropType, SlotsType } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { avatarGroupContextKey } from './context.js'
import { getAvatarClasses, getAvatarSlotClasses } from './styles/index.js'
import { avatarBadgePositions, avatarColors, avatarSizes } from './types.js'
import type {
  AvatarAs,
  AvatarBadgePosition,
  AvatarColor,
  AvatarLoadingStatus,
  AvatarOptions,
  AvatarSize,
  AvatarSlots,
  AvatarUI,
} from './types.js'

export const MkAvatar = defineComponent({
  name: 'MkAvatar',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<AvatarAs>,
      default: 'span',
    },
    src: {
      type: String,
      default: undefined,
    },
    alt: {
      type: String,
      default: '',
    },
    fallback: {
      type: String,
      default: undefined,
    },
    delayMs: {
      type: Number,
      default: undefined,
    },
    color: {
      type: String as PropType<AvatarColor>,
      default: undefined,
      validator: (value: AvatarColor) => avatarColors.includes(value),
    },
    size: {
      type: String as PropType<AvatarSize>,
      default: undefined,
      validator: (value: AvatarSize) => avatarSizes.includes(value),
    },
    square: {
      type: Boolean,
      default: undefined,
    },
    badge: {
      type: Boolean,
      default: false,
    },
    badgeColor: {
      type: String as PropType<AvatarColor>,
      default: undefined,
      validator: (value: AvatarColor) => avatarColors.includes(value),
    },
    badgePosition: {
      type: String as PropType<AvatarBadgePosition>,
      default: undefined,
      validator: (value: AvatarBadgePosition) => avatarBadgePositions.includes(value),
    },
    referrerPolicy: {
      type: String as PropType<AvatarOptions['referrerPolicy']>,
      default: undefined,
    },
    crossOrigin: {
      type: String as PropType<AvatarOptions['crossOrigin']>,
      default: undefined,
    },
    loading: {
      type: String as PropType<AvatarOptions['loading']>,
      default: undefined,
    },
    decoding: {
      type: String as PropType<AvatarOptions['decoding']>,
      default: undefined,
    },
    ui: {
      type: Object as PropType<AvatarUI>,
      default: undefined,
    },
  },
  emits: {
    loadingStatusChange: (value: unknown): value is AvatarLoadingStatus =>
      value === 'idle' || value === 'loading' || value === 'loaded' || value === 'error',
  },
  slots: Object as SlotsType<AvatarSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const avatarGroup = inject(avatarGroupContextKey, undefined)

    return () => {
      const avatarConfig = options.ui?.avatar
      const color = props.color ?? avatarConfig?.defaultVariants?.color ?? 'secondary'
      const size =
        props.size ?? avatarGroup?.size.value ?? avatarConfig?.defaultVariants?.size ?? 'md'
      const square = props.square ?? avatarConfig?.defaultVariants?.square ?? false
      const badgeColor = props.badgeColor ?? avatarConfig?.defaultVariants?.badgeColor ?? 'success'
      const badgePosition =
        props.badgePosition ?? avatarConfig?.defaultVariants?.badgePosition ?? 'bottom-right'
      const attributes: HTMLAttributes = attrs

      return h(
        AvatarRoot,
        {
          ...attributes,
          as: props.as,
          class: getAvatarClasses({
            color,
            size,
            square,
            config: avatarConfig,
            ui: props.ui,
            className: attributes.class,
          }),
          'data-mk-color': color,
          'data-mk-size': size,
          'data-mk-square': square ? '' : undefined,
          'data-mk-badge-color': props.badge ? badgeColor : undefined,
          'data-mk-badge-position': props.badge ? badgePosition : undefined,
        },
        {
          default: () => [
            props.src
              ? h(AvatarImage, {
                  as: 'img',
                  src: props.src,
                  alt: props.alt,
                  ...(props.referrerPolicy === undefined
                    ? {}
                    : { referrerPolicy: props.referrerPolicy }),
                  ...(props.crossOrigin === undefined ? {} : { crossOrigin: props.crossOrigin }),
                  ...(props.loading === undefined ? {} : { loading: props.loading }),
                  ...(props.decoding === undefined ? {} : { decoding: props.decoding }),
                  class: getAvatarSlotClasses({
                    slot: 'image',
                    badgeColor,
                    size,
                    badgePosition,
                    config: avatarConfig,
                    ui: props.ui,
                  }),
                  onLoadingStatusChange: (value: AvatarLoadingStatus) => {
                    emit('loadingStatusChange', value)
                  },
                })
              : undefined,
            h(
              AvatarFallback,
              {
                as: 'span',
                ...(props.delayMs === undefined ? {} : { delayMs: props.delayMs }),
                class: getAvatarSlotClasses({
                  slot: 'fallback',
                  badgeColor,
                  size,
                  badgePosition,
                  config: avatarConfig,
                  ui: props.ui,
                }),
              },
              {
                default: () => slots.default?.() ?? props.fallback,
              },
            ),
            props.badge
              ? h('span', {
                  'aria-hidden': 'true',
                  'data-mk-color': badgeColor,
                  class: getAvatarSlotClasses({
                    slot: 'badge',
                    badgeColor,
                    size,
                    badgePosition,
                    config: avatarConfig,
                    ui: props.ui,
                  }),
                })
              : undefined,
          ],
        },
      )
    }
  },
})
