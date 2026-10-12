import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const cardVariants = ['default', 'muted', 'outline'] as const
export const cardSizes = ['sm', 'md', 'lg'] as const

export type CardVariant = (typeof cardVariants)[number]
export type CardSize = (typeof cardSizes)[number]

export interface CardUI {
  base?: ModeKitClassValue
  header?: ModeKitClassValue
  body?: ModeKitClassValue
  footer?: ModeKitClassValue
}

export interface CardStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<CardUI, 'base'>
  variants?: {
    variant?: Partial<Record<CardVariant, ModeKitClassValue>>
    size?: Partial<Record<CardSize, ModeKitClassValue>>
  }
  defaultVariants?: {
    variant?: CardVariant
    size?: CardSize
  }
}

export interface CardOptions {
  variant?: CardVariant
  size?: CardSize
  ui?: CardUI
}

export type CardProps = Omit<HTMLAttributes, keyof CardOptions> & CardOptions

export interface CardSlots {
  default?(): VNodeChild
  header?(): VNodeChild
  footer?(): VNodeChild
}
