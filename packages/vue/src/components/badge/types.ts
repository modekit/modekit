import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const badgeColors = [
  'primary',
  'secondary',
  'success',
  'warning',
  'info',
  'destructive',
] as const
export const badgeVariants = ['default', 'soft', 'outline', 'subtle'] as const
export const badgeSizes = ['sm', 'md', 'lg'] as const

export type BadgeColor = (typeof badgeColors)[number]
export type BadgeVariant = (typeof badgeVariants)[number]
export type BadgeSize = (typeof badgeSizes)[number]
export type BadgeAs = NonNullable<PrimitiveProps['as']>

export interface BadgeUI {
  base?: ModeKitClassValue
}

export interface BadgeCompoundVariant {
  color?: BadgeColor | readonly BadgeColor[]
  variant?: BadgeVariant | readonly BadgeVariant[]
  size?: BadgeSize | readonly BadgeSize[]
  rounded?: boolean | readonly boolean[]
  class: ModeKitClassValue
}

export interface BadgeStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    color?: Partial<Record<BadgeColor, ModeKitClassValue>>
    variant?: Partial<Record<BadgeVariant, ModeKitClassValue>>
    size?: Partial<Record<BadgeSize, ModeKitClassValue>>
    rounded?: Partial<Record<'true' | 'false', ModeKitClassValue>>
  }
  compoundVariants?: readonly BadgeCompoundVariant[]
  defaultVariants?: {
    color?: BadgeColor
    variant?: BadgeVariant
    size?: BadgeSize
    rounded?: boolean
  }
}

export interface BadgeOptions {
  as?: BadgeAs
  color?: BadgeColor
  variant?: BadgeVariant
  size?: BadgeSize
  rounded?: boolean
  ui?: BadgeUI
}

export type BadgeProps = Omit<HTMLAttributes, keyof BadgeOptions> & BadgeOptions

export interface BadgeSlots {
  default?(): VNodeChild
  leading?(): VNodeChild
  trailing?(): VNodeChild
}
