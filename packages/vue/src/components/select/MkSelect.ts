import {
  SelectArrow,
  SelectContent,
  SelectGroup as SelectPrimitiveGroup,
  SelectItem as SelectPrimitiveItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel as SelectPrimitiveLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator as SelectPrimitiveSeparator,
  SelectTrigger,
  SelectValue as SelectPrimitiveValue,
  SelectViewport,
} from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { MkSpinner } from '../spinner/MkSpinner.js'
import { getSelectClasses, getSelectSlotClasses } from './styles/index.js'
import {
  selectAlignments,
  selectDirections,
  selectPositions,
  selectPositionStrategies,
  selectSides,
  selectSizes,
  selectVariants,
} from './types.js'
import type {
  SelectAlign,
  SelectCollisionPadding,
  SelectDirection,
  SelectGroup,
  SelectItem,
  SelectModelValue,
  SelectOption,
  SelectPortalTarget,
  SelectPosition,
  SelectPositionStrategy,
  SelectSide,
  SelectSize,
  SelectSlots,
  SelectUI,
  SelectValue,
  SelectVariant,
} from './types.js'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isSelectValue(value: unknown): value is SelectValue {
  return typeof value === 'string' || isFiniteNumber(value)
}

function isSelectModelValue(value: unknown): value is SelectModelValue {
  return isSelectValue(value) || (Array.isArray(value) && value.every(isSelectValue))
}

function isCollisionPadding(value: unknown): value is SelectCollisionPadding {
  return isFiniteNumber(value) || (typeof value === 'object' && value !== null)
}

function isOption(item: SelectItem): item is SelectOption {
  return item.type === undefined || item.type === 'item'
}

function isGroup(item: SelectItem): item is SelectGroup {
  return item.type === 'group'
}

function flattenOptions(items: readonly SelectItem[]): readonly SelectOption[] {
  return items.flatMap((item) => (isOption(item) ? [item] : isGroup(item) ? item.items : []))
}

function valuesOf(modelValue: SelectModelValue | undefined): readonly SelectValue[] {
  if (modelValue === undefined) return []
  if (typeof modelValue === 'string' || typeof modelValue === 'number') return [modelValue]
  return modelValue
}

function isSelected(item: SelectOption, modelValue: SelectModelValue | undefined): boolean {
  return valuesOf(modelValue).includes(item.value)
}

function renderChevron(direction: 'up' | 'down'): VNodeChild {
  const path = direction === 'up' ? 'm4 10 4-4 4 4' : 'm4 6 4 4 4-4'
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      fill: 'none',
      viewBox: '0 0 16 16',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '1.75',
    },
    [h('path', { d: path })],
  )
}

function renderCheck(): VNodeChild {
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      fill: 'none',
      viewBox: '0 0 16 16',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
    },
    [h('path', { d: 'm3.5 8.5 3 3 6-7' })],
  )
}

export const MkSelect = defineComponent({
  name: 'MkSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Array] as PropType<SelectModelValue>,
      default: undefined,
      validator: isSelectModelValue,
    },
    defaultValue: {
      type: [String, Number, Array] as PropType<SelectModelValue>,
      default: undefined,
      validator: (value: unknown) => value === undefined || isSelectModelValue(value),
    },
    open: {
      type: Boolean,
      default: undefined,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array as PropType<readonly SelectItem[]>,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    emptyText: {
      type: String,
      default: 'No options',
    },
    name: {
      type: String,
      default: undefined,
    },
    autocomplete: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    dir: {
      type: String as PropType<SelectDirection>,
      default: undefined,
      validator: (value: SelectDirection) => selectDirections.includes(value),
    },
    size: {
      type: String as PropType<SelectSize>,
      default: undefined,
      validator: (value: SelectSize) => selectSizes.includes(value),
    },
    variant: {
      type: String as PropType<SelectVariant>,
      default: undefined,
      validator: (value: SelectVariant) => selectVariants.includes(value),
    },
    position: {
      type: String as PropType<SelectPosition>,
      default: 'popper',
      validator: (value: SelectPosition) => selectPositions.includes(value),
    },
    side: {
      type: String as PropType<SelectSide>,
      default: 'bottom',
      validator: (value: SelectSide) => selectSides.includes(value),
    },
    align: {
      type: String as PropType<SelectAlign>,
      default: 'start',
      validator: (value: SelectAlign) => selectAlignments.includes(value),
    },
    sideOffset: {
      type: Number,
      default: 6,
      validator: isFiniteNumber,
    },
    alignOffset: {
      type: Number,
      default: 0,
      validator: isFiniteNumber,
    },
    avoidCollisions: {
      type: Boolean,
      default: true,
    },
    collisionPadding: {
      type: [Number, Object] as PropType<SelectCollisionPadding>,
      default: 8,
      validator: isCollisionPadding,
    },
    hideWhenDetached: {
      type: Boolean,
      default: false,
    },
    positionStrategy: {
      type: String as PropType<SelectPositionStrategy>,
      default: 'fixed',
      validator: (value: SelectPositionStrategy) => selectPositionStrategies.includes(value),
    },
    bodyLock: {
      type: Boolean,
      default: true,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    unmountOnHide: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<SelectPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<SelectUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': isSelectModelValue,
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    itemSelect: (_item: SelectOption, index: number, event: Event) =>
      Number.isInteger(index) && event instanceof Event,
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
    closeAutoFocus: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<SelectSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const selectConfig = options.ui?.select
      const size = props.size ?? selectConfig?.defaultVariants?.size ?? 'md'
      const variant = props.variant ?? selectConfig?.defaultVariants?.variant ?? 'outline'
      const { class: className, ...triggerAttributes } = attrs as HTMLAttributes
      const ariaInvalid = triggerAttributes['aria-invalid']
      const invalid =
        props.invalid ||
        (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== 'false')
      const allOptions = flattenOptions(props.items)
      const rootProps: Record<string, unknown> = {
        defaultValue: props.defaultValue,
        defaultOpen: props.defaultOpen,
        multiple: props.multiple,
        name: props.name,
        autocomplete: props.autocomplete,
        required: props.required,
        disabled: props.disabled,
        dir: props.dir,
        'onUpdate:modelValue': (value: SelectModelValue) => {
          emit('update:modelValue', value)
        },
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }
      if (props.modelValue !== undefined) rootProps.modelValue = props.modelValue
      if (props.open !== undefined) rootProps.open = props.open

      const slotClass = (slot: Exclude<keyof SelectUI, 'base'>) =>
        getSelectSlotClasses({ slot, size, config: selectConfig, ui: props.ui })

      return h(SelectRoot, rootProps, {
        default: ({
          modelValue,
          open,
        }: {
          modelValue: SelectModelValue | undefined
          open: boolean
        }) => {
          const selectedItems = valuesOf(modelValue)
            .map((value) => allOptions.find((item) => item.value === value))
            .filter((item): item is SelectOption => item !== undefined)
          const slotProps = {
            modelValue,
            selectedItems,
            open,
            size,
            variant,
            disabled: props.disabled,
            loading: props.loading,
          }

          const renderOption = (item: SelectOption, index: number, key: string): VNodeChild => {
            const selected = isSelected(item, modelValue)
            const itemSlotProps = { item, index, selected, size }

            return h(
              SelectPrimitiveItem as Component,
              {
                key,
                value: item.value,
                disabled: item.disabled ?? false,
                textValue: item.textValue ?? item.label,
                class: slotClass('item'),
                onSelect: (event: Event) => {
                  emit('itemSelect', item, index, event)
                },
              },
              {
                default: () => [
                  h(
                    SelectItemIndicator,
                    { class: slotClass('indicator') },
                    {
                      default: () =>
                        slots.indicator?.(itemSlotProps) ??
                        h('span', { class: slotClass('indicatorIcon') }, [renderCheck()]),
                    },
                  ),
                  slots['item-leading']
                    ? h('span', { class: slotClass('itemLeading') }, [
                        slots['item-leading'](itemSlotProps),
                      ])
                    : undefined,
                  h('span', { class: slotClass('itemText') }, [
                    h(
                      SelectItemText,
                      { class: slotClass('itemLabel') },
                      { default: () => slots.item?.(itemSlotProps) ?? item.label },
                    ),
                    item.description
                      ? h('span', { class: slotClass('itemDescription') }, item.description)
                      : undefined,
                  ]),
                  slots['item-trailing']
                    ? h('span', { class: slotClass('itemTrailing') }, [
                        slots['item-trailing'](itemSlotProps),
                      ])
                    : undefined,
                ],
              },
            )
          }

          let optionIndex = 0
          const itemNodes = props.items.map((item, itemIndex) => {
            if (isOption(item)) {
              const currentIndex = optionIndex++
              return renderOption(
                item,
                currentIndex,
                `item-${String(item.value)}-${String(itemIndex)}`,
              )
            }
            if (isGroup(item)) {
              return h(
                SelectPrimitiveGroup,
                {
                  key: `group-${item.label ?? ''}-${String(itemIndex)}`,
                  class: slotClass('group'),
                },
                {
                  default: () => [
                    item.label
                      ? h(
                          SelectPrimitiveLabel,
                          { class: slotClass('label') },
                          { default: () => item.label },
                        )
                      : undefined,
                    ...item.items.map((option, groupIndex) => {
                      const currentIndex = optionIndex++
                      return renderOption(
                        option,
                        currentIndex,
                        `group-item-${String(option.value)}-${String(itemIndex)}-${String(groupIndex)}`,
                      )
                    }),
                  ],
                },
              )
            }
            return h(SelectPrimitiveSeparator, {
              key: `separator-${String(itemIndex)}`,
              class: slotClass('separator'),
            })
          })

          const trigger = h(
            SelectTrigger as Component,
            {
              ...triggerAttributes,
              class: getSelectClasses({
                size,
                variant,
                config: selectConfig,
                ui: props.ui,
                className,
              }),
              disabled: props.disabled,
              'aria-invalid': props.invalid ? 'true' : ariaInvalid,
              'aria-busy': props.loading ? 'true' : triggerAttributes['aria-busy'],
              'data-mk-size': size,
              'data-mk-variant': variant,
              'data-mk-invalid': invalid ? '' : undefined,
              'data-mk-loading': props.loading ? '' : undefined,
            },
            {
              default: () => [
                slots.leading
                  ? h('span', { class: slotClass('leading') }, [slots.leading(slotProps)])
                  : undefined,
                h(
                  SelectPrimitiveValue as Component,
                  {
                    ...(props.placeholder === undefined ? {} : { placeholder: props.placeholder }),
                    class: selectedItems.length ? slotClass('value') : slotClass('placeholder'),
                  },
                  {
                    default: () =>
                      slots.value?.({ ...slotProps, placeholder: props.placeholder }) ??
                      (selectedItems.length
                        ? selectedItems.map((item) => item.label).join(', ')
                        : props.placeholder),
                  },
                ),
                h('span', { class: slotClass('trailing') }, [
                  props.loading
                    ? (slots.loader?.(slotProps) ??
                      h(MkSpinner, {
                        size,
                        'aria-hidden': 'true',
                        class: slotClass('spinner'),
                      }))
                    : (slots.trailing?.(slotProps) ??
                      h('span', { class: slotClass('triggerIcon') }, [renderChevron('down')])),
                ]),
              ],
            },
          )

          const content = h(
            SelectContent as Component,
            {
              position: props.position,
              side: props.side,
              align: props.align,
              sideOffset: props.sideOffset,
              alignOffset: props.alignOffset,
              avoidCollisions: props.avoidCollisions,
              collisionPadding: props.collisionPadding,
              hideWhenDetached: props.hideWhenDetached,
              positionStrategy: props.positionStrategy,
              bodyLock: props.bodyLock,
              loop: props.loop,
              forceMount: !props.unmountOnHide,
              class: slotClass('content'),
              'data-mk-size': size,
              'data-mk-position': props.position,
              onEscapeKeyDown: (event: KeyboardEvent) => {
                emit('escapeKeyDown', event)
              },
              onPointerDownOutside: (event: Event) => {
                emit('pointerDownOutside', event)
              },
              onCloseAutoFocus: (event: Event) => {
                emit('closeAutoFocus', event)
              },
            },
            {
              default: () => [
                h(
                  SelectScrollUpButton,
                  { class: slotClass('scrollButton') },
                  { default: () => renderChevron('up') },
                ),
                h(
                  SelectViewport,
                  { class: slotClass('viewport') },
                  {
                    default: () => [
                      ...itemNodes,
                      allOptions.length === 0
                        ? h('div', { class: slotClass('empty') }, [
                            slots.empty?.(slotProps) ?? props.emptyText,
                          ])
                        : undefined,
                    ],
                  },
                ),
                h(
                  SelectScrollDownButton,
                  { class: slotClass('scrollButton') },
                  { default: () => renderChevron('down') },
                ),
                props.arrow && props.position === 'popper'
                  ? h(
                      SelectArrow,
                      {
                        width: 12,
                        height: 6,
                        rounded: true,
                        class: slotClass('arrow'),
                      },
                      slots.arrow ? { default: slots.arrow } : undefined,
                    )
                  : undefined,
              ],
            },
          )

          return [
            trigger,
            props.portal === false
              ? content
              : h(SelectPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => content,
                }),
          ]
        },
      })
    }
  },
})
