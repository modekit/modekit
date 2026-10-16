import type { TextareaHTMLAttributes } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const textareaSizes = ['sm', 'md', 'lg'] as const
export const textareaVariants = ['outline', 'soft', 'subtle', 'ghost', 'plain'] as const
export const textareaResizeModes = ['none', 'vertical', 'horizontal', 'both'] as const

export type TextareaSize = (typeof textareaSizes)[number]
export type TextareaVariant = (typeof textareaVariants)[number]
export type TextareaResize = (typeof textareaResizeModes)[number]
export type TextareaValue = string | number

export interface TextareaUI {
  base?: ModeKitClassValue
  textarea?: ModeKitClassValue
}

export interface TextareaStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<TextareaUI, 'base'>
  variants?: {
    size?: Partial<Record<TextareaSize, ModeKitClassValue>>
    variant?: Partial<Record<TextareaVariant, ModeKitClassValue>>
    resize?: Partial<Record<TextareaResize, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: TextareaSize
    variant?: TextareaVariant
    resize?: TextareaResize
  }
}

export interface TextareaOptions {
  modelValue?: TextareaValue
  defaultValue?: TextareaValue
  size?: TextareaSize
  variant?: TextareaVariant
  resize?: TextareaResize
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  ui?: TextareaUI
}

export type TextareaProps = Omit<TextareaHTMLAttributes, keyof TextareaOptions | 'value'> &
  TextareaOptions

export interface TextareaEmits {
  'update:modelValue': [value: string]
}
