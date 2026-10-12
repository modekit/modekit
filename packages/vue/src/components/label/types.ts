import type { LabelHTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const labelSizes = ['sm', 'md', 'lg'] as const

export type LabelSize = (typeof labelSizes)[number]

export interface LabelUI {
  base?: ModeKitClassValue
  requiredIndicator?: ModeKitClassValue
}

export interface LabelStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<LabelUI, 'base'>
  variants?: {
    size?: Partial<Record<LabelSize, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: LabelSize
  }
}

export interface LabelOptions {
  for?: string
  size?: LabelSize
  required?: boolean
  disabled?: boolean
  ui?: LabelUI
}

export type LabelProps = Omit<LabelHTMLAttributes, keyof LabelOptions> & LabelOptions

export interface LabelSlots {
  default?(): VNodeChild
}
