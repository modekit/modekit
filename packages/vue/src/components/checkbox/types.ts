import type { ButtonHTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const checkboxSizes = ['sm', 'md', 'lg'] as const
export const checkboxVariants = ['default', 'card'] as const

export type CheckboxSize = (typeof checkboxSizes)[number]
export type CheckboxVariant = (typeof checkboxVariants)[number]
export type CheckboxState = boolean | 'indeterminate'

export interface CheckboxUI {
  base?: ModeKitClassValue
  control?: ModeKitClassValue
  indicator?: ModeKitClassValue
  icon?: ModeKitClassValue
  content?: ModeKitClassValue
  label?: ModeKitClassValue
  description?: ModeKitClassValue
}

export interface CheckboxStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<CheckboxUI, 'base'>
  variants?: {
    size?: Partial<Record<CheckboxSize, ModeKitClassValue>>
    variant?: Partial<Record<CheckboxVariant, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: CheckboxSize
    variant?: CheckboxVariant
  }
}

export interface CheckboxOptions {
  modelValue?: CheckboxState
  defaultValue?: CheckboxState
  label?: string
  description?: string
  size?: CheckboxSize
  variant?: CheckboxVariant
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string | number
  ui?: CheckboxUI
}

export type CheckboxProps = Omit<ButtonHTMLAttributes, keyof CheckboxOptions> & CheckboxOptions

export interface CheckboxEmits {
  'update:modelValue': [value: CheckboxState]
}

export interface CheckboxSlotProps {
  state: CheckboxState
}

export interface CheckboxLabelSlotProps {
  label: string | undefined
}

export interface CheckboxDescriptionSlotProps {
  description: string | undefined
}

export interface CheckboxSlots {
  indicator?(props: CheckboxSlotProps): VNodeChild
  label?(props: CheckboxLabelSlotProps): VNodeChild
  description?(props: CheckboxDescriptionSlotProps): VNodeChild
}
