import type { ButtonHTMLAttributes } from 'vue'

export const buttonVariants = ['primary', 'secondary', 'tertiary', 'destructive'] as const
export const buttonTypes = ['button', 'submit', 'reset'] as const

export type ButtonVariant = (typeof buttonVariants)[number]
export type ButtonType = (typeof buttonTypes)[number]

export interface ButtonOptions {
  variant?: ButtonVariant
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
}

export type ButtonProps = Omit<ButtonHTMLAttributes, keyof ButtonOptions> & ButtonOptions

export interface ButtonSlots {
  default?(): unknown
  leading?(): unknown
  trailing?(): unknown
  loader?(): unknown
}
