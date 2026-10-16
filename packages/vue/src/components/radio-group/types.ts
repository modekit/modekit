import type { Component, HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const radioGroupSizes = ['sm', 'md', 'lg'] as const
export const radioGroupVariants = ['default', 'card', 'table', 'segmented', 'pills'] as const
export const radioGroupOrientations = ['vertical', 'horizontal'] as const

export type RadioGroupSize = (typeof radioGroupSizes)[number]
export type RadioGroupVariant = (typeof radioGroupVariants)[number]
export type RadioGroupOrientation = (typeof radioGroupOrientations)[number]
export type RadioGroupValue = string | number

export interface RadioGroupItem {
  label: string
  value: RadioGroupValue
  description?: string
  icon?: Component
  disabled?: boolean
}

export interface RadioGroupUI {
  base?: ModeKitClassValue
  header?: ModeKitClassValue
  label?: ModeKitClassValue
  description?: ModeKitClassValue
  options?: ModeKitClassValue
  item?: ModeKitClassValue
  control?: ModeKitClassValue
  indicator?: ModeKitClassValue
  icon?: ModeKitClassValue
  content?: ModeKitClassValue
  itemLabel?: ModeKitClassValue
  itemDescription?: ModeKitClassValue
}

export interface RadioGroupStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<RadioGroupUI, 'base'>
  variants?: {
    size?: Partial<Record<RadioGroupSize, ModeKitClassValue>>
    variant?: Partial<Record<RadioGroupVariant, ModeKitClassValue>>
    orientation?: Partial<Record<RadioGroupOrientation, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: RadioGroupSize
    variant?: RadioGroupVariant
    orientation?: RadioGroupOrientation
  }
}

export interface RadioGroupOptions {
  modelValue?: RadioGroupValue
  defaultValue?: RadioGroupValue
  items: readonly RadioGroupItem[]
  label?: string
  description?: string
  size?: RadioGroupSize
  variant?: RadioGroupVariant
  orientation?: RadioGroupOrientation
  disabled?: boolean
  required?: boolean
  name?: string
  loop?: boolean
  ui?: RadioGroupUI
}

export type RadioGroupProps = Omit<HTMLAttributes, keyof RadioGroupOptions> & RadioGroupOptions

export interface RadioGroupEmits {
  'update:modelValue': [value: RadioGroupValue]
}

export interface RadioGroupItemSlotProps {
  item: RadioGroupItem
  index: number
  checked: boolean
  disabled: boolean
  size: RadioGroupSize
}

export interface RadioGroupLabelSlotProps {
  label: string | undefined
}

export interface RadioGroupDescriptionSlotProps {
  description: string | undefined
}

export interface RadioGroupSlots {
  label?(props: RadioGroupLabelSlotProps): VNodeChild
  description?(props: RadioGroupDescriptionSlotProps): VNodeChild
  indicator?(props: RadioGroupItemSlotProps): VNodeChild
  icon?(props: RadioGroupItemSlotProps): VNodeChild
  'item-label'?(props: RadioGroupItemSlotProps): VNodeChild
  'item-description'?(props: RadioGroupItemSlotProps): VNodeChild
}
