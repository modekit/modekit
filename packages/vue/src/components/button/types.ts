import type { ButtonHTMLAttributes, VNodeChild } from 'vue'

import { modeKitColors } from '../../colors.js'
import type { ModeKitColor } from '../../colors.js'
import type { ModeKitClassValue } from '../../types/classes.js'

export const buttonVariants = ['default', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
export const buttonColors = modeKitColors
export const buttonSizes = ['xs', 'sm', 'md', 'lg'] as const
export const buttonTypes = ['button', 'submit', 'reset'] as const

export type ButtonVariant = (typeof buttonVariants)[number]
export type ButtonColor = ModeKitColor
export type ButtonSize = (typeof buttonSizes)[number]
export type ButtonType = (typeof buttonTypes)[number]

export interface ButtonUI {
  base?: ModeKitClassValue
}

export interface ButtonCompoundVariant {
  color?: ButtonColor | readonly ButtonColor[]
  variant?: ButtonVariant | readonly ButtonVariant[]
  size?: ButtonSize | readonly ButtonSize[]
  class: ModeKitClassValue
}

export interface ButtonStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    color?: Partial<Record<ButtonColor, ModeKitClassValue>>
    variant?: Partial<Record<ButtonVariant, ModeKitClassValue>>
    size?: Partial<Record<ButtonSize, ModeKitClassValue>>
  }
  compoundVariants?: readonly ButtonCompoundVariant[]
  defaultVariants?: {
    color?: ButtonColor
    variant?: ButtonVariant
    size?: ButtonSize
  }
}

export interface ButtonOptions {
  color?: ButtonColor
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
  square?: boolean
  ui?: ButtonUI
}

export type ButtonProps = Omit<ButtonHTMLAttributes, keyof ButtonOptions> & ButtonOptions

export interface ButtonSlots {
  default?(): VNodeChild
  leading?(): VNodeChild
  trailing?(): VNodeChild
  loader?(): VNodeChild
}
