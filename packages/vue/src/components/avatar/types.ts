import type { AvatarRootProps } from 'reka-ui'
import type { HTMLAttributes, ImgHTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const avatarColors = [
  'primary',
  'secondary',
  'success',
  'warning',
  'info',
  'destructive',
] as const
export const avatarSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export const avatarBadgePositions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const

export type AvatarColor = (typeof avatarColors)[number]
export type AvatarSize = (typeof avatarSizes)[number]
export type AvatarBadgePosition = (typeof avatarBadgePositions)[number]
export type AvatarAs = NonNullable<AvatarRootProps['as']>
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
