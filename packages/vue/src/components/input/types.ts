import type { InputHTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const inputSizes = ['sm', 'md', 'lg'] as const
export const inputVariants = ['outline', 'soft', 'subtle', 'ghost', 'plain'] as const
export const inputFloatingPositions = ['inside', 'border'] as const

export type InputSize = (typeof inputSizes)[number]
export type InputVariant = (typeof inputVariants)[number]
export type InputFloating = (typeof inputFloatingPositions)[number]
export type InputValue = string | number

export interface InputUI {
  base?: ModeKitClassValue
  input?: ModeKitClassValue
  leading?: ModeKitClassValue
  trailing?: ModeKitClassValue
  label?: ModeKitClassValue
  spinner?: ModeKitClassValue
}

export interface InputStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<InputUI, 'base'>
  variants?: {
    size?: Partial<Record<InputSize, ModeKitClassValue>>
    variant?: Partial<Record<InputVariant, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: InputSize
    variant?: InputVariant
  }
}

export interface InputOptions {
  modelValue?: InputValue
  defaultValue?: InputValue
  floating?: InputFloating
  label?: string
  size?: InputSize
  variant?: InputVariant
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  loading?: boolean
  ui?: InputUI
}

export type InputProps = Omit<InputHTMLAttributes, keyof InputOptions | 'value'> & InputOptions

export interface InputEmits {
  'update:modelValue': [value: string]
}

export interface InputSlotProps {
  size: InputSize
  variant: InputVariant
  disabled: boolean
  readonly: boolean
  loading: boolean
}

export interface InputLabelSlotProps extends InputSlotProps {
  label: string | undefined
  floating: InputFloating
}

export interface InputSlots {
  leading?(props: InputSlotProps): VNodeChild
  trailing?(props: InputSlotProps): VNodeChild
  loader?(props: InputSlotProps): VNodeChild
  label?(props: InputLabelSlotProps): VNodeChild
}
