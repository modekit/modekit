import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const selectSizes = ['sm', 'md', 'lg'] as const
export const selectVariants = ['outline', 'soft', 'subtle', 'ghost', 'plain'] as const
export const selectSides = ['top', 'right', 'bottom', 'left'] as const
export const selectAlignments = ['start', 'center', 'end'] as const
export const selectPositions = ['popper', 'item-aligned'] as const
export const selectPositionStrategies = ['absolute', 'fixed'] as const
export const selectDirections = ['ltr', 'rtl'] as const

export type SelectSize = (typeof selectSizes)[number]
export type SelectVariant = (typeof selectVariants)[number]
export type SelectSide = (typeof selectSides)[number]
export type SelectAlign = (typeof selectAlignments)[number]
export type SelectPosition = (typeof selectPositions)[number]
export type SelectPositionStrategy = (typeof selectPositionStrategies)[number]
export type SelectDirection = (typeof selectDirections)[number]
export type SelectValue = string | number
export type SelectModelValue = SelectValue | readonly SelectValue[]
export type SelectPortalTarget = boolean | string | HTMLElement
export type SelectCollisionPadding = number | Partial<Record<SelectSide, number>>

export interface SelectOption {
  type?: 'item'
  label: string
  value: SelectValue
  description?: string
  disabled?: boolean
  textValue?: string
}

export interface SelectGroup {
  type: 'group'
  label?: string
  items: readonly SelectOption[]
}

export interface SelectSeparator {
  type: 'separator'
}

export type SelectItem = SelectOption | SelectGroup | SelectSeparator

export interface SelectUI {
  base?: ModeKitClassValue
  leading?: ModeKitClassValue
  value?: ModeKitClassValue
  placeholder?: ModeKitClassValue
  trailing?: ModeKitClassValue
  triggerIcon?: ModeKitClassValue
  spinner?: ModeKitClassValue
  content?: ModeKitClassValue
  viewport?: ModeKitClassValue
  scrollButton?: ModeKitClassValue
  group?: ModeKitClassValue
  label?: ModeKitClassValue
  separator?: ModeKitClassValue
  item?: ModeKitClassValue
  itemLeading?: ModeKitClassValue
  itemText?: ModeKitClassValue
  itemLabel?: ModeKitClassValue
  itemDescription?: ModeKitClassValue
  itemTrailing?: ModeKitClassValue
  indicator?: ModeKitClassValue
  indicatorIcon?: ModeKitClassValue
  empty?: ModeKitClassValue
  arrow?: ModeKitClassValue
}

export interface SelectStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    size?: Partial<Record<SelectSize, ModeKitClassValue>>
    variant?: Partial<Record<SelectVariant, ModeKitClassValue>>
  }
  slots?: Omit<SelectUI, 'base'>
  defaultVariants?: {
    size?: SelectSize
    variant?: SelectVariant
  }
}

export interface SelectOptions {
  modelValue?: SelectModelValue
  defaultValue?: SelectModelValue
  open?: boolean
  defaultOpen?: boolean
  items?: readonly SelectItem[]
  multiple?: boolean
  placeholder?: string
  emptyText?: string
  name?: string
  autocomplete?: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  loading?: boolean
  dir?: SelectDirection
  size?: SelectSize
  variant?: SelectVariant
  position?: SelectPosition
  side?: SelectSide
  align?: SelectAlign
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: SelectCollisionPadding
  hideWhenDetached?: boolean
  positionStrategy?: SelectPositionStrategy
  bodyLock?: boolean
  loop?: boolean
  unmountOnHide?: boolean
  arrow?: boolean
  portal?: SelectPortalTarget
  ui?: SelectUI
}

export type SelectProps = Omit<HTMLAttributes, keyof SelectOptions> & SelectOptions

export interface SelectEmits {
  'update:modelValue': [value: SelectModelValue]
  'update:open': [value: boolean]
  itemSelect: [item: SelectOption, index: number, event: Event]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  closeAutoFocus: [event: Event]
}

export interface SelectSlotProps {
  modelValue: SelectModelValue | undefined
  selectedItems: readonly SelectOption[]
  open: boolean
  size: SelectSize
  variant: SelectVariant
  disabled: boolean
  loading: boolean
}

export interface SelectValueSlotProps extends SelectSlotProps {
  placeholder: string | undefined
}

export interface SelectItemSlotProps {
  item: SelectOption
  index: number
  selected: boolean
  size: SelectSize
}

export interface SelectSlots {
  leading?(props: SelectSlotProps): VNodeChild
  value?(props: SelectValueSlotProps): VNodeChild
  trailing?(props: SelectSlotProps): VNodeChild
  loader?(props: SelectSlotProps): VNodeChild
  item?(props: SelectItemSlotProps): VNodeChild
  'item-leading'?(props: SelectItemSlotProps): VNodeChild
  'item-trailing'?(props: SelectItemSlotProps): VNodeChild
  indicator?(props: SelectItemSlotProps): VNodeChild
  empty?(props: SelectSlotProps): VNodeChild
  arrow?(): VNodeChild
}
