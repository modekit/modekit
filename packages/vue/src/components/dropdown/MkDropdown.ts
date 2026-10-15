import {
  DropdownMenuArrow as DropdownArrow,
  DropdownMenuContent as DropdownContent,
  DropdownMenuPortal as DropdownPortal,
  DropdownMenuRoot as DropdownRoot,
  DropdownMenuTrigger as DropdownTrigger,
} from 'reka-ui'
import { computed, defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { provideDropdownContext } from './context.js'
import {
  MkDropdownCheckboxItem,
  MkDropdownGroup,
  MkDropdownItem,
  MkDropdownLabel,
  MkDropdownRadioGroup,
  MkDropdownRadioItem,
  MkDropdownSeparator,
  MkDropdownSub,
  MkDropdownSubContent,
  MkDropdownSubTrigger,
} from './parts.js'
import { getDropdownClasses, getDropdownSlotClasses } from './styles/index.js'
import {
  dropdownAlignments,
  dropdownDirections,
  dropdownPositionStrategies,
  dropdownSides,
  dropdownSizes,
} from './types.js'
import type {
  DropdownAlign,
  DropdownActionItem,
  DropdownCollisionPadding,
  DropdownDirection,
  DropdownItem,
  DropdownPortalTarget,
  DropdownPositionStrategy,
  DropdownSelectableItem,
  DropdownSide,
  DropdownSize,
  DropdownSlots,
  DropdownUI,
} from './types.js'

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isCollisionPadding(value: unknown): value is DropdownCollisionPadding {
  return isFiniteNumber(value) || (typeof value === 'object' && value !== null)
}

export const MkDropdown = defineComponent({
  name: 'MkDropdown',
  inheritAttrs: false,
  props: {
    open: {
      type: Boolean,
      default: undefined,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dir: {
      type: String as PropType<DropdownDirection>,
      default: undefined,
      validator: (value: DropdownDirection) => dropdownDirections.includes(value),
    },
    loop: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array as PropType<readonly DropdownItem[]>,
      default: () => [],
    },
    size: {
      type: String as PropType<DropdownSize>,
      default: undefined,
      validator: (value: DropdownSize) => dropdownSizes.includes(value),
    },
    side: {
      type: String as PropType<DropdownSide>,
      default: 'bottom',
      validator: (value: DropdownSide) => dropdownSides.includes(value),
    },
    align: {
      type: String as PropType<DropdownAlign>,
      default: 'start',
      validator: (value: DropdownAlign) => dropdownAlignments.includes(value),
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
    arrow: {
      type: Boolean,
      default: false,
    },
    portal: {
      type: [Boolean, String, Object] as PropType<DropdownPortalTarget>,
      default: true,
    },
    ui: {
      type: Object as PropType<DropdownUI>,
      default: undefined,
    },
  },
  emits: {
    'update:open': (value: unknown): value is boolean => typeof value === 'boolean',
    itemSelect: (_item: DropdownSelectableItem, index: number, event: Event) =>
      Number.isInteger(index) && event instanceof Event,
    escapeKeyDown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
    pointerDownOutside: (event: Event) => event instanceof Event,
    focusOutside: (event: Event) => event instanceof Event,
    interactOutside: (event: Event) => event instanceof Event,
    openAutoFocus: (event: Event) => event instanceof Event,
    closeAutoFocus: (event: Event) => event instanceof Event,
  },
  slots: Object as SlotsType<DropdownSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()
    const config = computed(() => options.ui?.dropdown)
    const size = computed(() => props.size ?? config.value?.defaultVariants?.size ?? 'md')
    const portal = computed(() => props.portal)
    const ui = computed(() => props.ui)

    provideDropdownContext({ size, portal, config, ui })

    function getItemKey(item: DropdownItem, index: number): string {
      const label = 'label' in item ? item.label : ''
      return `${item.type ?? 'item'}-${label}-${String(index)}`
    }

    function emitItemSelect(item: DropdownSelectableItem, index: number, event: Event): void {
      item.onSelect?.(event)
      emit('itemSelect', item, index, event)
    }

    function renderActionItem(item: DropdownActionItem, index: number): VNodeChild {
      return h(
        MkDropdownItem,
        {
          key: getItemKey(item, index),
          color: item.color ?? 'neutral',
          disabled: item.disabled ?? false,
          inset: item.inset ?? false,
          textValue: item.textValue ?? item.label,
          onSelect: (event: Event) => {
            emitItemSelect(item, index, event)
          },
        },
        {
          default: () => slots.item?.({ item, index }) ?? item.label,
        },
      )
    }

    function renderItems(items: readonly DropdownItem[]): VNodeChild[] {
      return items.map((item, index) => {
        switch (item.type) {
          case 'checkbox':
            return h(
              MkDropdownCheckboxItem as Component,
              {
                key: getItemKey(item, index),
                modelValue: item.checked,
                color: item.color ?? 'neutral',
                disabled: item.disabled ?? false,
                textValue: item.textValue ?? item.label,
                'onUpdate:modelValue': (checked: boolean) => {
                  item.onCheckedChange?.(checked)
                },
                onSelect: (event: Event) => {
                  emitItemSelect(item, index, event)
                },
              },
              { default: () => item.label },
            )
          case 'radio-group':
            return h(
              MkDropdownRadioGroup as Component,
              {
                key: getItemKey(item, index),
                modelValue: item.value,
                'onUpdate:modelValue': (value: string | number) => {
                  item.onValueChange?.(value)
                },
              },
              {
                default: () =>
                  item.items.map((radioItem, radioIndex) =>
                    h(
                      MkDropdownRadioItem as Component,
                      {
                        key: `${String(radioItem.value)}-${String(radioIndex)}`,
                        value: radioItem.value,
                        color: radioItem.color ?? 'neutral',
                        disabled: radioItem.disabled ?? false,
                        textValue: radioItem.textValue ?? radioItem.label,
                        onSelect: (event: Event) => {
                          emitItemSelect(radioItem, radioIndex, event)
                        },
                      },
                      { default: () => radioItem.label },
                    ),
                  ),
              },
            )
          case 'submenu':
            return h(
              MkDropdownSub as Component,
              {
                key: getItemKey(item, index),
                open: item.open,
                defaultOpen: item.defaultOpen ?? false,
                'onUpdate:open': (open: boolean) => {
                  item.onOpenChange?.(open)
                },
              },
              {
                default: () => [
                  h(
                    MkDropdownSubTrigger as Component,
                    {
                      disabled: item.disabled ?? false,
                      inset: item.inset ?? false,
                      textValue: item.textValue ?? item.label,
                      graceDuration: item.graceDuration,
                    },
                    { default: () => item.label },
                  ),
                  h(
                    MkDropdownSubContent as Component,
                    {
                      sideOffset: item.sideOffset,
                      alignOffset: item.alignOffset,
                    },
                    { default: () => renderItems(item.items) },
                  ),
                ],
              },
            )
          case 'label':
            return h(
              MkDropdownLabel,
              { key: getItemKey(item, index), inset: item.inset ?? false },
              { default: () => item.label },
            )
          case 'separator':
            return h(MkDropdownSeparator, { key: getItemKey(item, index) })
          case 'group':
            return h(
              MkDropdownGroup,
              { key: getItemKey(item, index) },
              {
                default: () => [
                  item.label
                    ? h(
                        MkDropdownLabel,
                        { inset: item.inset ?? false },
                        { default: () => item.label },
                      )
                    : undefined,
                  ...renderItems(item.items),
                ],
              },
            )
          default:
            return renderActionItem(item, index)
        }
      })
    }

    return () => {
      const { class: className, ...attributes } = attrs as HTMLAttributes
      const contentProps = {
        ...attributes,
        side: props.side,
        align: props.align,
        sideOffset: props.sideOffset,
        alignOffset: props.alignOffset,
        avoidCollisions: props.avoidCollisions,
        collisionPadding: props.collisionPadding,
        hideWhenDetached: props.hideWhenDetached,
        positionStrategy: props.positionStrategy,
        loop: props.loop,
        class: getDropdownClasses({
          size: size.value,
          config: config.value,
          ui: props.ui,
          className,
        }),
        'data-mk-size': size.value,
        'data-mk-side': props.side,
        'data-mk-align': props.align,
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
      }
      const rootProps: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        dir: props.dir,
        'onUpdate:open': (value: boolean) => {
          emit('update:open', value)
        },
      }

      if (props.open !== undefined) rootProps.open = props.open

      return h(DropdownRoot, rootProps, {
        default: ({ open }: { open: boolean }): VNodeChild[] => {
          const content = h(DropdownContent as Component, contentProps, {
            default: () => [
              ...renderItems(props.items),
              slots.content?.({ open }),
              props.arrow
                ? h(
                    DropdownArrow,
                    {
                      width: 12,
                      height: 6,
                      rounded: true,
                      class: getDropdownSlotClasses({
                        slot: 'arrow',
                        size: size.value,
                        config: config.value,
                        ui: props.ui,
                      }),
                    },
                    slots.arrow ? { default: slots.arrow } : undefined,
                  )
                : undefined,
            ],
          })
          const overlay =
            props.portal === false
              ? content
              : h(DropdownPortal, props.portal === true ? undefined : { to: props.portal }, {
                  default: () => content,
                })

          return [
            h(
              DropdownTrigger,
              { asChild: true, disabled: props.disabled },
              { default: slots.default },
            ),
            overlay,
          ]
        },
      })
    }
  },
})
