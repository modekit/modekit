import type { AvatarRootProps } from 'reka-ui'
import type { HTMLAttributes, ImgHTMLAttributes, VNodeChild } from 'vue'

import { modeKitColors } from '../../colors.js'
import type { ModeKitColor } from '../../colors.js'
import type { ModeKitClassValue } from '../../types/classes.js'

export const avatarColors = modeKitColors
export const avatarSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export const avatarBadgePositions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const
export const avatarGroupSpacings = ['tight', 'normal', 'loose'] as const

export type AvatarColor = ModeKitColor
export type AvatarSize = (typeof avatarSizes)[number]
export type AvatarBadgePosition = (typeof avatarBadgePositions)[number]
export type AvatarGroupSpacing = (typeof avatarGroupSpacings)[number]
export type AvatarAs = NonNullable<AvatarRootProps['as']>
export type AvatarGroupAs = AvatarAs
export type AvatarLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface AvatarUI {
  base?: ModeKitClassValue
  image?: ModeKitClassValue
  fallback?: ModeKitClassValue
  badge?: ModeKitClassValue
}

export interface AvatarStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<AvatarUI, 'base'>
  variants?: {
    color?: Partial<Record<AvatarColor, ModeKitClassValue>>
    badgeColor?: Partial<Record<AvatarColor, ModeKitClassValue>>
    size?: Partial<Record<AvatarSize, ModeKitClassValue>>
    square?: Partial<Record<'true' | 'false', ModeKitClassValue>>
    badgePosition?: Partial<Record<AvatarBadgePosition, ModeKitClassValue>>
  }
  defaultVariants?: {
    color?: AvatarColor
    badgeColor?: AvatarColor
    size?: AvatarSize
    square?: boolean
    badgePosition?: AvatarBadgePosition
  }
}

export interface AvatarOptions {
  as?: AvatarAs
  src?: string
  alt?: string
  fallback?: string
  delayMs?: number
  color?: AvatarColor
  size?: AvatarSize
  square?: boolean
  badge?: boolean
  badgeColor?: AvatarColor
  badgePosition?: AvatarBadgePosition
  referrerPolicy?: ImgHTMLAttributes['referrerpolicy']
  crossOrigin?: ImgHTMLAttributes['crossorigin']
  loading?: ImgHTMLAttributes['loading']
  decoding?: ImgHTMLAttributes['decoding']
  ui?: AvatarUI
}

export type AvatarProps = Omit<HTMLAttributes, keyof AvatarOptions> & AvatarOptions

export interface AvatarEmits {
  loadingStatusChange: [value: AvatarLoadingStatus]
}

export interface AvatarSlots {
  default?(): VNodeChild
}

export type AvatarGroupSlot = 'item' | 'overflow'

export interface AvatarGroupUI {
  base?: ModeKitClassValue
  item?: ModeKitClassValue
  overflow?: ModeKitClassValue
}

export interface AvatarGroupStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<AvatarGroupUI, 'base'>
  variants?: {
    size?: Partial<Record<AvatarSize, ModeKitClassValue>>
    spacing?: Partial<Record<AvatarGroupSpacing, ModeKitClassValue>>
    overflowColor?: Partial<Record<AvatarColor, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: AvatarSize
    spacing?: AvatarGroupSpacing
    overflowColor?: AvatarColor
  }
}

export interface AvatarGroupOptions {
  as?: AvatarGroupAs
  size?: AvatarSize
  spacing?: AvatarGroupSpacing
  max?: number
  overflowColor?: AvatarColor
  overflowLabel?: string
  ui?: AvatarGroupUI
}

export type AvatarGroupProps = Omit<HTMLAttributes, keyof AvatarGroupOptions> & AvatarGroupOptions

export interface AvatarGroupOverflowSlotProps {
  count: number
}

export interface AvatarGroupSlots {
  default?(): VNodeChild
  overflow?(props: AvatarGroupOverflowSlotProps): VNodeChild
}
