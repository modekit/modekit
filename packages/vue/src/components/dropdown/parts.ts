/* eslint-disable vue/one-component-per-file -- Compound menu parts share rendering helpers and one injected styling context. */
import {
  DropdownMenuCheckboxItem as DropdownCheckboxItem,
  DropdownMenuFilter as DropdownFilter,
  DropdownMenuGroup as DropdownGroup,
  DropdownMenuItem as DropdownItem,
  DropdownMenuItemIndicator as DropdownItemIndicator,
  DropdownMenuLabel as DropdownLabel,
  DropdownMenuPortal as DropdownPortal,
  DropdownMenuRadioGroup as DropdownRadioGroup,
  DropdownMenuRadioItem as DropdownRadioItem,
  DropdownMenuSeparator as DropdownSeparator,
  DropdownMenuSub as DropdownSub,
  DropdownMenuSubContent as DropdownSubContent,
  DropdownMenuSubTrigger as DropdownSubTrigger,
} from 'reka-ui'
import { defineComponent, h } from 'vue'
import type {
  Component,
  HTMLAttributes,
  InputHTMLAttributes,
  PropType,
  SlotsType,
  VNodeChild,
} from 'vue'

import type { ModeKitColor } from '../../colors.js'
import { useDropdownContext } from './context.js'
import { getDropdownSlotClasses } from './styles/index.js'
import { dropdownItemColors, dropdownPositionStrategies } from './types.js'
import type {
  DropdownAs,
  DropdownCheckedState,
  DropdownCheckboxItemSlots,
  DropdownCollisionPadding,
  DropdownFilterSlots,
  DropdownGroupSlots,
  DropdownItemSlots,
  DropdownLabelSlots,
  DropdownPortalTarget,
  DropdownPositionStrategy,
  DropdownRadioGroupSlots,
  DropdownRadioItemSlots,
  DropdownSeparatorSlots,
  DropdownSubContentSlots,
  DropdownSubSlots,
  DropdownSubTriggerSlots,
  DropdownValue,
} from './types.js'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isCollisionPadding(value: unknown): value is DropdownCollisionPadding {
  return isFiniteNumber(value) || (typeof value === 'object' && value !== null)
}

function isMenuValue(value: unknown): value is DropdownValue {
  return typeof value === 'string' || typeof value === 'number'
}

function renderCheckIcon(className: string): VNodeChild {
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      class: className,
      fill: 'none',
      viewBox: '0 0 16 16',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
    },
    [h('path', { d: 'm3 8 3 3 7-7' })],
  )
}

function renderRadioIcon(className: string): VNodeChild {
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      class: className,
      fill: 'currentColor',
      viewBox: '0 0 16 16',
    },
    [h('circle', { cx: '8', cy: '8', r: '3' })],
  )
}

function renderSubIndicator(className: string): VNodeChild {
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      class: className,
      fill: 'none',
      viewBox: '0 0 16 16',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '1.75',
    },
    [h('path', { d: 'm6 3.5 4.5 4.5L6 12.5' })],
  )
}

export const MkDropdownItem = defineComponent({
  name: 'MkDropdownItem',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    textValue: {
      type: String,
      default: undefined,
    },
    color: {
      type: String as PropType<ModeKitColor>,
      default: 'neutral',
      validator: (value: ModeKitColor) => dropdownItemColors.includes(value),
    },
    inset: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    select: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<DropdownItemSlots>,
  setup(props, { attrs, emit, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes

      return h(
        DropdownItem as Component,
        {
          ...attributes,
          as: props.as,
          disabled: props.disabled,
          textValue: props.textValue,
          class: getDropdownSlotClasses({
            slot: 'item',
            size: context.size.value,
            inset: props.inset,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
          'data-mk-color': props.color,
          'data-mk-inset': props.inset ? '' : undefined,
          onSelect: (event: Event) => {
            emit('select', event)
          },
        },
        {
          default: () => [
            slots.leading
              ? h(
                  'span',
                  {
                    class: getDropdownSlotClasses({
                      slot: 'itemLeading',
                      size: context.size.value,
                      config: context.config.value,
                      ui: context.ui.value,
                    }),
                  },
                  [slots.leading()],
                )
              : undefined,
            h(
              'span',
              {
                class: getDropdownSlotClasses({
                  slot: 'itemLabel',
                  size: context.size.value,
                  config: context.config.value,
                  ui: context.ui.value,
                }),
              },
              [slots.default?.()],
            ),
            slots.trailing
              ? h(
                  'span',
                  {
                    class: getDropdownSlotClasses({
                      slot: 'itemTrailing',
                      size: context.size.value,
                      config: context.config.value,
                      ui: context.ui.value,
                    }),
                  },
                  [slots.trailing()],
                )
              : undefined,
          ],
        },
      )
    }
  },
})

export const MkDropdownLabel = defineComponent({
  name: 'MkDropdownLabel',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    inset: {
      type: Boolean,
      default: false,
    },
  },
  slots: Object as SlotsType<DropdownLabelSlots>,
  setup(props, { attrs, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes

      return h(
        DropdownLabel,
        {
          ...attributes,
          as: props.as,
          class: getDropdownSlotClasses({
            slot: 'label',
            size: context.size.value,
            inset: props.inset,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
          'data-mk-inset': props.inset ? '' : undefined,
        },
        { default: slots.default },
      )
    }
  },
})

export const MkDropdownSeparator = defineComponent({
  name: 'MkDropdownSeparator',
  inheritAttrs: false,
  slots: Object as SlotsType<DropdownSeparatorSlots>,
  setup(_, { attrs, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes

      return h(
        DropdownSeparator,
        {
          ...attributes,
          class: getDropdownSlotClasses({
            slot: 'separator',
            size: context.size.value,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
        },
        { default: slots.default },
      )
    }
  },
})

export const MkDropdownGroup = defineComponent({
  name: 'MkDropdownGroup',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
  },
  slots: Object as SlotsType<DropdownGroupSlots>,
  setup(props, { attrs, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes

      return h(
        DropdownGroup,
        {
          ...attributes,
          as: props.as,
          class: getDropdownSlotClasses({
            slot: 'group',
            size: context.size.value,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
        },
        { default: slots.default },
      )
    }
  },
})

export const MkDropdownCheckboxItem = defineComponent({
  name: 'MkDropdownCheckboxItem',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    modelValue: {
      type: [Boolean, String] as PropType<DropdownCheckedState>,
      default: undefined,
      validator: (value: unknown): value is DropdownCheckedState =>
        typeof value === 'boolean' || value === 'indeterminate',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    textValue: {
      type: String,
      default: undefined,
    },
    color: {
      type: String as PropType<ModeKitColor>,
      default: 'neutral',
      validator: (value: ModeKitColor) => dropdownItemColors.includes(value),
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is boolean => typeof value === 'boolean',
    select: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<DropdownCheckboxItemSlots>,
  setup(props, { attrs, emit, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const itemProps: Record<string, unknown> = {
        ...attributes,
        as: props.as,
        disabled: props.disabled,
        textValue: props.textValue,
        class: getDropdownSlotClasses({
          slot: 'item',
          size: context.size.value,
          checkable: true,
          config: context.config.value,
          ui: context.ui.value,
          className,
        }),
        'data-mk-color': props.color,
        onSelect: (event: Event) => {
          emit('select', event)
        },
        'onUpdate:modelValue': (value: boolean) => {
          emit('update:modelValue', value)
        },
      }

      if (props.modelValue !== undefined) itemProps.modelValue = props.modelValue

      return h(DropdownCheckboxItem as Component, itemProps, {
        default: ({ checked }: { checked: DropdownCheckedState }) => {
          const slotProps = { checked }

          return [
            h(
              DropdownItemIndicator,
              {
                class: getDropdownSlotClasses({
                  slot: 'indicator',
                  size: context.size.value,
                  config: context.config.value,
                  ui: context.ui.value,
                }),
              },
              {
                default: () =>
                  slots.indicator?.(slotProps) ??
                  renderCheckIcon(
                    getDropdownSlotClasses({
                      slot: 'indicatorIcon',
                      size: context.size.value,
                      config: context.config.value,
                      ui: context.ui.value,
                    }),
                  ),
              },
            ),
            h(
              'span',
              {
                class: getDropdownSlotClasses({
                  slot: 'itemLabel',
                  size: context.size.value,
                  config: context.config.value,
                  ui: context.ui.value,
                }),
              },
              [slots.default?.(slotProps)],
            ),
            slots.trailing
              ? h(
                  'span',
                  {
                    class: getDropdownSlotClasses({
                      slot: 'itemTrailing',
                      size: context.size.value,
                      config: context.config.value,
                      ui: context.ui.value,
                    }),
                  },
                  [slots.trailing(slotProps)],
                )
              : undefined,
          ]
        },
      })
    }
  },
})

export const MkDropdownRadioGroup = defineComponent({
  name: 'MkDropdownRadioGroup',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    modelValue: {
      type: [String, Number] as PropType<DropdownValue>,
      default: undefined,
      validator: isMenuValue,
    },
  },
  emits: {
    'update:modelValue': isMenuValue,
  },
  slots: Object as SlotsType<DropdownRadioGroupSlots>,
  setup(props, { attrs, emit, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const groupProps: Record<string, unknown> = {
        ...attributes,
        as: props.as,
        class: getDropdownSlotClasses({
          slot: 'group',
          size: context.size.value,
          config: context.config.value,
          ui: context.ui.value,
          className,
        }),
        'onUpdate:modelValue': (value: DropdownValue) => {
          emit('update:modelValue', value)
        },
      }

      if (props.modelValue !== undefined) groupProps.modelValue = props.modelValue

      return h(DropdownRadioGroup as Component, groupProps, {
        default: ({ modelValue }: { modelValue: DropdownValue | undefined }) =>
          slots.default?.({ modelValue }),
      })
    }
  },
})

export const MkDropdownRadioItem = defineComponent({
  name: 'MkDropdownRadioItem',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    value: {
      type: [String, Number] as PropType<DropdownValue>,
      required: true,
      validator: isMenuValue,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    textValue: {
      type: String,
      default: undefined,
    },
    color: {
      type: String as PropType<ModeKitColor>,
      default: 'neutral',
      validator: (value: ModeKitColor) => dropdownItemColors.includes(value),
    },
  },
  emits: {
    select: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<DropdownRadioItemSlots>,
  setup(props, { attrs, emit, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes

      return h(
        DropdownRadioItem as Component,
        {
          ...attributes,
          as: props.as,
          value: props.value,
          disabled: props.disabled,
          textValue: props.textValue,
          class: getDropdownSlotClasses({
            slot: 'item',
            size: context.size.value,
            checkable: true,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
          'data-mk-color': props.color,
          onSelect: (event: Event) => {
            emit('select', event)
          },
        },
        {
          default: ({ checked }: { checked: boolean }) => {
            const slotProps = { checked }

            return [
              h(
                DropdownItemIndicator,
                {
                  class: getDropdownSlotClasses({
                    slot: 'indicator',
                    size: context.size.value,
                    config: context.config.value,
                    ui: context.ui.value,
                  }),
                },
                {
                  default: () =>
                    slots.indicator?.(slotProps) ??
                    renderRadioIcon(
                      getDropdownSlotClasses({
                        slot: 'indicatorIcon',
                        size: context.size.value,
                        config: context.config.value,
                        ui: context.ui.value,
                      }),
                    ),
                },
              ),
              h(
                'span',
                {
                  class: getDropdownSlotClasses({
                    slot: 'itemLabel',
                    size: context.size.value,
                    config: context.config.value,
                    ui: context.ui.value,
                  }),
                },
                [slots.default?.(slotProps)],
              ),
              slots.trailing
                ? h(
                    'span',
                    {
                      class: getDropdownSlotClasses({
                        slot: 'itemTrailing',
                        size: context.size.value,
                        config: context.config.value,
                        ui: context.ui.value,
                      }),
                    },
                    [slots.trailing(slotProps)],
                  )
                : undefined,
            ]
          },
        },
      )
    }
  },
})

export const MkDropdownFilter = defineComponent({
  name: 'MkDropdownFilter',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'input',
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is string => typeof value === 'string',
  },
  slots: Object as SlotsType<DropdownFilterSlots>,
  setup(props, { attrs, emit, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as InputHTMLAttributes
      const filterProps: Record<string, unknown> = {
        ...attributes,
        as: props.as,
        autoFocus: props.autoFocus,
        disabled: props.disabled,
        class: getDropdownSlotClasses({
          slot: 'filter',
          size: context.size.value,
          config: context.config.value,
          ui: context.ui.value,
          className,
        }),
        'onUpdate:modelValue': (value: string) => {
          emit('update:modelValue', value)
        },
      }

      if (props.modelValue !== undefined) filterProps.modelValue = props.modelValue

      return h(DropdownFilter as Component, filterProps, {
        default: ({ modelValue }: { modelValue: string | undefined }) =>
          slots.default?.({ modelValue }),
      })
    }
  },
})

export const MkDropdownSub = defineComponent({
  name: 'MkDropdownSub',
  props: {
    open: {
      type: Boolean,
      default: undefined,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
  },
  slots: Object as SlotsType<DropdownSubSlots>,
  setup(props, { emit, slots }) {
    useDropdownContext()

    return () => {
      const subProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) subProps.open = props.open

      return h(DropdownSub, subProps, {
        default: ({ open }: { open: boolean }) => slots.default?.({ open }),
      })
    }
  },
})

export const MkDropdownSubTrigger = defineComponent({
  name: 'MkDropdownSubTrigger',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    textValue: {
      type: String,
      default: undefined,
    },
    inset: {
      type: Boolean,
      default: false,
    },
    graceDuration: {
      type: Number,
      default: 300,
      validator: isFiniteNumber,
    },
  },
  slots: Object as SlotsType<DropdownSubTriggerSlots>,
  setup(props, { attrs, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes

      return h(
        DropdownSubTrigger as Component,
        {
          ...attributes,
          as: props.as,
          disabled: props.disabled,
          textValue: props.textValue,
          graceDuration: props.graceDuration,
          class: getDropdownSlotClasses({
            slot: 'subTrigger',
            size: context.size.value,
            inset: props.inset,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
          'data-mk-inset': props.inset ? '' : undefined,
        },
        {
          default: () => [
            slots.leading
              ? h(
                  'span',
                  {
                    class: getDropdownSlotClasses({
                      slot: 'itemLeading',
                      size: context.size.value,
                      config: context.config.value,
                      ui: context.ui.value,
                    }),
                  },
                  [slots.leading()],
                )
              : undefined,
            h(
              'span',
              {
                class: getDropdownSlotClasses({
                  slot: 'itemLabel',
                  size: context.size.value,
                  config: context.config.value,
                  ui: context.ui.value,
                }),
              },
              [slots.default?.()],
            ),
            slots.trailing?.() ??
              renderSubIndicator(
                getDropdownSlotClasses({
                  slot: 'subIndicator',
                  size: context.size.value,
                  config: context.config.value,
                  ui: context.ui.value,
                }),
              ),
          ],
        },
      )
    }
  },
})

export const MkDropdownSubContent = defineComponent({
  name: 'MkDropdownSubContent',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object, Function] as PropType<DropdownAs>,
      default: 'div',
    },
    sideOffset: {
      type: Number,
      default: 4,
      validator: isFiniteNumber,
    },
    alignOffset: {
      type: Number,
      default: -4,
      validator: isFiniteNumber,
    },
    avoidCollisions: {
      type: Boolean,
      default: true,
    },
    collisionPadding: {
      type: [Number, Object] as PropType<DropdownCollisionPadding>,
      default: 8,
      validator: isCollisionPadding,
    },
    hideWhenDetached: {
      type: Boolean,
      default: false,
    },
    positionStrategy: {
      type: String as PropType<DropdownPositionStrategy>,
      default: 'fixed',
      validator: (value: DropdownPositionStrategy) => dropdownPositionStrategies.includes(value),
    },
    loop: {
      type: Boolean,
      default: true,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<DropdownPortalTarget>,
      default: undefined,
    },
  },
  emits: {
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
    focusOutside: (event: Event) => event instanceof Event,
    interactOutside: (event: Event) => event instanceof Event,
    openAutoFocus: (event: Event) => event instanceof Event,
    closeAutoFocus: (event: Event) => event instanceof Event,
    entryFocus: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<DropdownSubContentSlots>,
  setup(props, { attrs, emit, slots }) {
    const context = useDropdownContext()

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const content = h(
        DropdownSubContent as Component,
        {
          ...attributes,
          as: props.as,
          sideOffset: props.sideOffset,
          alignOffset: props.alignOffset,
          avoidCollisions: props.avoidCollisions,
          collisionPadding: props.collisionPadding,
          hideWhenDetached: props.hideWhenDetached,
          positionStrategy: props.positionStrategy,
          loop: props.loop,
          class: getDropdownSlotClasses({
            slot: 'subContent',
            size: context.size.value,
            config: context.config.value,
            ui: context.ui.value,
            className,
          }),
          'data-mk-size': context.size.value,
          onEscapeKeyDown: (event: KeyboardEvent) => {
            emit('escapeKeyDown', event)
          },
          onPointerDownOutside: (event: Event) => {
            emit('pointerDownOutside', event)
          },
          onFocusOutside: (event: Event) => {
            emit('focusOutside', event)
          },
          onInteractOutside: (event: Event) => {
            emit('interactOutside', event)
          },
          onOpenAutoFocus: (event: Event) => {
            emit('openAutoFocus', event)
          },
          onCloseAutoFocus: (event: Event) => {
            emit('closeAutoFocus', event)
          },
          onEntryFocus: (event: Event) => {
            emit('entryFocus', event)
          },
        },
        { default: slots.default },
      )
      const portal = props.portal ?? context.portal.value

      return portal === false
        ? content
        : h(DropdownPortal, portal === true ? undefined : { to: portal }, {
            default: () => content,
          })
    }
  },
})
