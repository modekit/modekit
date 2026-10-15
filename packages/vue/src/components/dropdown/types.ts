import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, InputHTMLAttributes, VNodeChild } from 'vue'

import { modeKitColors } from '../../colors.js'
import type { ModeKitColor } from '../../colors.js'
import type { ModeKitClassValue } from '../../types/classes.js'

export const dropdownSizes = ['sm', 'md', 'lg'] as const
export const dropdownItemColors = modeKitColors
export const dropdownSides = ['top', 'right', 'bottom', 'left'] as const
export const dropdownAlignments = ['start', 'center', 'end'] as const
export const dropdownPositionStrategies = ['absolute', 'fixed'] as const
export const dropdownDirections = ['ltr', 'rtl'] as const

export type DropdownSize = (typeof dropdownSizes)[number]
export type DropdownSide = (typeof dropdownSides)[number]
export type DropdownAlign = (typeof dropdownAlignments)[number]
export type DropdownPositionStrategy = (typeof dropdownPositionStrategies)[number]
export type DropdownDirection = (typeof dropdownDirections)[number]
export type DropdownAs = NonNullable<PrimitiveProps['as']>
export type DropdownPortalTarget = boolean | string | HTMLElement
export type DropdownCollisionPadding = number | Partial<Record<DropdownSide, number>>
export type DropdownCheckedState = boolean | 'indeterminate'
export type DropdownValue = string | number

export interface DropdownUI {
  base?: ModeKitClassValue
  arrow?: ModeKitClassValue
  group?: ModeKitClassValue
  label?: ModeKitClassValue
  separator?: ModeKitClassValue
  item?: ModeKitClassValue
  itemLeading?: ModeKitClassValue
  itemLabel?: ModeKitClassValue
  itemTrailing?: ModeKitClassValue
  indicator?: ModeKitClassValue
  indicatorIcon?: ModeKitClassValue
  filter?: ModeKitClassValue
  subTrigger?: ModeKitClassValue
  subContent?: ModeKitClassValue
  subIndicator?: ModeKitClassValue
}

export interface DropdownStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<DropdownUI, 'base'>
  defaultVariants?: {
    size?: DropdownSize
  }
}

export interface DropdownActionItem {
  type?: 'item'
  label: string
  color?: ModeKitColor
  disabled?: boolean
  inset?: boolean
  textValue?: string
  onSelect?: (event: Event) => void
}

export interface DropdownCheckboxItem {
  type: 'checkbox'
  label: string
  checked?: DropdownCheckedState
  color?: ModeKitColor
  disabled?: boolean
  textValue?: string
  onCheckedChange?: (checked: boolean) => void
  onSelect?: (event: Event) => void
}

export interface DropdownRadioItem {
  label: string
  value: DropdownValue
  color?: ModeKitColor
  disabled?: boolean
  textValue?: string
  onSelect?: (event: Event) => void
}

export interface DropdownRadioGroupItem {
  type: 'radio-group'
  value?: DropdownValue
  items: readonly DropdownRadioItem[]
  onValueChange?: (value: DropdownValue) => void
}

export interface DropdownSubmenuItem {
  type: 'submenu'
  label: string
  items: readonly DropdownItem[]
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  inset?: boolean
  textValue?: string
  graceDuration?: number
  sideOffset?: number
  alignOffset?: number
  onOpenChange?: (open: boolean) => void
}

export interface DropdownLabelItem {
  type: 'label'
  label: string
  inset?: boolean
}

export interface DropdownSeparatorItem {
  type: 'separator'
}

export interface DropdownGroupItem {
  type: 'group'
  label?: string
  inset?: boolean
  items: readonly DropdownItem[]
}

export type DropdownItem =
  | DropdownActionItem
  | DropdownCheckboxItem
  | DropdownRadioGroupItem
  | DropdownSubmenuItem
  | DropdownLabelItem
  | DropdownSeparatorItem
  | DropdownGroupItem

export type DropdownSelectableItem = DropdownActionItem | DropdownCheckboxItem | DropdownRadioItem

export interface DropdownOptions {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  disabled?: boolean
  dir?: DropdownDirection
  loop?: boolean
  items?: readonly DropdownItem[]
  size?: DropdownSize
  side?: DropdownSide
  align?: DropdownAlign
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: DropdownCollisionPadding
  hideWhenDetached?: boolean
  positionStrategy?: DropdownPositionStrategy
  arrow?: boolean
  portal?: DropdownPortalTarget
  ui?: DropdownUI
}

export type DropdownProps = Omit<HTMLAttributes, keyof DropdownOptions> & DropdownOptions

export interface DropdownEmits {
  'update:open': [value: boolean]
  itemSelect: [item: DropdownSelectableItem, index: number, event: Event]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
}

export interface DropdownSlotProps {
  open: boolean
}

export interface DropdownItemSlotProps {
  item: DropdownActionItem
  index: number
}

export interface DropdownSlots {
  default?(): VNodeChild
  content?(props: DropdownSlotProps): VNodeChild
  item?(props: DropdownItemSlotProps): VNodeChild
  arrow?(): VNodeChild
}

export interface DropdownItemOptions {
  as?: DropdownAs
  disabled?: boolean
  textValue?: string
  color?: ModeKitColor
  inset?: boolean
}

export type DropdownItemProps = Omit<HTMLAttributes, keyof DropdownItemOptions> &
  DropdownItemOptions

export interface DropdownItemEmits {
  select: [event: Event]
}

export interface DropdownItemSlots {
  default?(): VNodeChild
  leading?(): VNodeChild
  trailing?(): VNodeChild
}

export interface DropdownLabelOptions {
  as?: DropdownAs
  inset?: boolean
}

export type DropdownLabelProps = Omit<HTMLAttributes, keyof DropdownLabelOptions> &
  DropdownLabelOptions

export interface DropdownLabelSlots {
  default?(): VNodeChild
}

export type DropdownSeparatorProps = HTMLAttributes

export interface DropdownSeparatorSlots {
  default?(): VNodeChild
}

export interface DropdownGroupOptions {
  as?: DropdownAs
}

export type DropdownGroupProps = Omit<HTMLAttributes, keyof DropdownGroupOptions> &
  DropdownGroupOptions

export interface DropdownGroupSlots {
  default?(): VNodeChild
}

export interface DropdownCheckboxItemOptions extends Omit<DropdownItemOptions, 'inset'> {
  modelValue?: DropdownCheckedState
}

export type DropdownCheckboxItemProps = Omit<HTMLAttributes, keyof DropdownCheckboxItemOptions> &
  DropdownCheckboxItemOptions

export interface DropdownCheckboxItemEmits extends DropdownItemEmits {
  'update:modelValue': [value: boolean]
}

export interface DropdownCheckboxItemSlotProps {
  checked: DropdownCheckedState
}

export interface DropdownCheckboxItemSlots {
  default?(props: DropdownCheckboxItemSlotProps): VNodeChild
  indicator?(props: DropdownCheckboxItemSlotProps): VNodeChild
  trailing?(props: DropdownCheckboxItemSlotProps): VNodeChild
}

export interface DropdownRadioGroupOptions {
  as?: DropdownAs
  modelValue?: DropdownValue
}

export type DropdownRadioGroupProps = Omit<HTMLAttributes, keyof DropdownRadioGroupOptions> &
  DropdownRadioGroupOptions

export interface DropdownRadioGroupEmits {
  'update:modelValue': [value: DropdownValue]
}

export interface DropdownRadioGroupSlotProps {
  modelValue: DropdownValue | undefined
}

export interface DropdownRadioGroupSlots {
  default?(props: DropdownRadioGroupSlotProps): VNodeChild
}

export interface DropdownRadioItemOptions extends Omit<DropdownItemOptions, 'inset'> {
  value: DropdownValue
}

export type DropdownRadioItemProps = Omit<HTMLAttributes, keyof DropdownRadioItemOptions> &
  DropdownRadioItemOptions

export type DropdownRadioItemEmits = DropdownItemEmits

export interface DropdownRadioItemSlotProps {
  checked: boolean
}

export interface DropdownRadioItemSlots {
  default?(props: DropdownRadioItemSlotProps): VNodeChild
  indicator?(props: DropdownRadioItemSlotProps): VNodeChild
  trailing?(props: DropdownRadioItemSlotProps): VNodeChild
}

export interface DropdownFilterOptions {
  as?: DropdownAs
  modelValue?: string
  autoFocus?: boolean
  disabled?: boolean
}

export type DropdownFilterProps = Omit<InputHTMLAttributes, keyof DropdownFilterOptions> &
  DropdownFilterOptions

export interface DropdownFilterEmits {
  'update:modelValue': [value: string]
}

export interface DropdownFilterSlots {
  default?(props: { modelValue: string | undefined }): VNodeChild
}

export interface DropdownSubOptions {
  open?: boolean
  defaultOpen?: boolean
}

export type DropdownSubProps = DropdownSubOptions

export interface DropdownSubEmits {
  'update:open': [value: boolean]
}

export interface DropdownSubSlotProps {
  open: boolean
}

export interface DropdownSubSlots {
  default?(props: DropdownSubSlotProps): VNodeChild
}

export interface DropdownSubTriggerOptions {
  as?: DropdownAs
  disabled?: boolean
  textValue?: string
  inset?: boolean
  graceDuration?: number
}

export type DropdownSubTriggerProps = Omit<HTMLAttributes, keyof DropdownSubTriggerOptions> &
  DropdownSubTriggerOptions

export interface DropdownSubTriggerSlots {
  default?(): VNodeChild
  leading?(): VNodeChild
  trailing?(): VNodeChild
}

export interface DropdownSubContentOptions {
  as?: DropdownAs
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: DropdownCollisionPadding
  hideWhenDetached?: boolean
  positionStrategy?: DropdownPositionStrategy
  loop?: boolean
  portal?: DropdownPortalTarget
}

export type DropdownSubContentProps = Omit<HTMLAttributes, keyof DropdownSubContentOptions> &
  DropdownSubContentOptions

export interface DropdownSubContentEmits {
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
  entryFocus: [event: Event]
}

export interface DropdownSubContentSlots {
  default?(): VNodeChild
}
