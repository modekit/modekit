import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import { modeKitColors } from '../../colors.js'
import type { ModeKitColor } from '../../colors.js'
import type { ModeKitClassValue } from '../../types/classes.js'

export const toastColors = modeKitColors
export const toastVariants = ['solid', 'soft', 'outline'] as const
export const toastPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const
export const toastSwipeDirections = ['up', 'down', 'left', 'right'] as const
export const toastTypes = ['foreground', 'background'] as const

export type ToastColor = ModeKitColor
export type ToastVariant = (typeof toastVariants)[number]
export type ToastPosition = (typeof toastPositions)[number]
export type ToastSwipeDirection = (typeof toastSwipeDirections)[number]
export type ToastType = (typeof toastTypes)[number]
export type ToastAs = NonNullable<PrimitiveProps['as']>
export type ToastPortalTarget = boolean | string | HTMLElement
export type ToastId = string | number
export type ToastContent = VNodeChild | (() => VNodeChild)
export type ToastSlot = 'body' | 'icon' | 'content' | 'title' | 'description' | 'action' | 'close'

export type ToastSwipeEvent = { currentTarget: EventTarget & HTMLElement } & Omit<
  CustomEvent<{
    originalEvent: PointerEvent
    delta: { x: number; y: number }
  }>,
  'currentTarget'
>

export interface ToastUI {
  base?: ModeKitClassValue
  body?: ModeKitClassValue
  icon?: ModeKitClassValue
  content?: ModeKitClassValue
  title?: ModeKitClassValue
  description?: ModeKitClassValue
  action?: ModeKitClassValue
  close?: ModeKitClassValue
}

export interface ToastCompoundVariant {
  color?: ToastColor | readonly ToastColor[]
  variant?: ToastVariant | readonly ToastVariant[]
  class: ModeKitClassValue
}

export interface ToastStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<ToastUI, 'base'>
  variants?: {
    color?: Partial<Record<ToastColor, ModeKitClassValue>>
    variant?: Partial<Record<ToastVariant, ModeKitClassValue>>
  }
  compoundVariants?: readonly ToastCompoundVariant[]
  defaultVariants?: {
    color?: ToastColor
    variant?: ToastVariant
  }
}

export interface ToastActionData {
  label: ToastContent
  altText: string
  closeOnClick?: boolean
  onClick?(event: MouseEvent): void
}

export interface ToastData {
  id?: ToastId
  title?: ToastContent
  description?: ToastContent
  icon?: ToastContent
  actions?: readonly ToastActionData[]
  duration?: number
  type?: ToastType
  color?: ToastColor
  variant?: ToastVariant
  closeButton?: boolean
  closeLabel?: string
  onUpdateOpen?(open: boolean): void
}

export interface ToastState extends Omit<ToastData, 'id'> {
  id: ToastId
  open: boolean
}

export interface ToastInstance {
  id: ToastId
}

export interface ToastOptions {
  as?: ToastAs
  open?: boolean
  defaultOpen?: boolean
  forceMount?: boolean
  duration?: number
  type?: ToastType
  color?: ToastColor
  variant?: ToastVariant
  title?: string
  description?: string
  actions?: readonly ToastActionData[]
  actionAltText?: string
  actionCloseOnClick?: boolean
  closeButton?: boolean
  closeLabel?: string
  ui?: ToastUI
}

export type ToastProps = Omit<HTMLAttributes, keyof ToastOptions> & ToastOptions

export interface ToastEmits {
  'update:open': [value: boolean]
  action: [event: MouseEvent]
  escapeKeyDown: [event: KeyboardEvent]
  pause: []
  resume: []
  swipeStart: [event: ToastSwipeEvent]
  swipeMove: [event: ToastSwipeEvent]
  swipeCancel: [event: ToastSwipeEvent]
  swipeEnd: [event: ToastSwipeEvent]
}

export interface ToastSlotProps {
  open: boolean
  remaining: number
  duration: number
}

export interface ToastTitleSlotProps extends ToastSlotProps {
  title: string | undefined
}

export interface ToastDescriptionSlotProps extends ToastSlotProps {
  description: string | undefined
}

export interface ToastActionSlotProps extends ToastSlotProps {
  altText: string
}

export interface ToastCloseSlotProps extends ToastSlotProps {
  label: string
}

export interface ToastSlots {
  icon?(props: ToastSlotProps): VNodeChild
  title?(props: ToastTitleSlotProps): VNodeChild
  default?(props: ToastDescriptionSlotProps): VNodeChild
  action?(props: ToastActionSlotProps): VNodeChild
  close?(props: ToastCloseSlotProps): VNodeChild
}

export interface ToastProviderUI {
  viewport?: ModeKitClassValue
}

export interface ToastProviderStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    position?: Partial<Record<ToastPosition, ModeKitClassValue>>
  }
  defaultVariants?: {
    position?: ToastPosition
  }
}

export interface ToastProviderOptions {
  label?: string
  duration?: number
  disableSwipe?: boolean
  swipeDirection?: ToastSwipeDirection
  swipeThreshold?: number
  limit?: number
  hotkey?: string[]
  viewportLabel?: string | ((hotkey: string) => string)
  position?: ToastPosition
  portal?: ToastPortalTarget
  ui?: ToastProviderUI
}

export type ToastProviderProps = Omit<HTMLAttributes, keyof ToastProviderOptions> &
  ToastProviderOptions

export interface ToastProviderSlots {
  default?(): VNodeChild
}
