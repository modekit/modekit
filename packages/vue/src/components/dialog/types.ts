import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const dialogSizes = ['sm', 'md', 'lg', 'xl'] as const
export const dialogAnimations = ['scale', 'fade', 'slide-up', 'slide-down', 'none'] as const

export type DialogSize = (typeof dialogSizes)[number]
export type DialogAnimation = (typeof dialogAnimations)[number]
export type DialogAs = NonNullable<PrimitiveProps['as']>
export type DialogPortalTarget = boolean | string | HTMLElement

export interface DialogUI {
  base?: ModeKitClassValue
  overlay?: ModeKitClassValue
  header?: ModeKitClassValue
  title?: ModeKitClassValue
  description?: ModeKitClassValue
  body?: ModeKitClassValue
  footer?: ModeKitClassValue
  close?: ModeKitClassValue
}

export interface DialogStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    size?: Partial<Record<DialogSize, ModeKitClassValue>>
    animation?: Partial<Record<DialogAnimation, ModeKitClassValue>>
  }
  slots?: Omit<DialogUI, 'base'>
  defaultVariants?: {
    size?: DialogSize
    animation?: DialogAnimation
  }
}

export interface DialogOptions {
  as?: DialogAs
  title?: string
  description?: string
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  dismissible?: boolean
  unmountOnHide?: boolean
  size?: DialogSize
  animation?: DialogAnimation
  closeButton?: boolean
  closeLabel?: string
  portal?: DialogPortalTarget
  ui?: DialogUI
}

export type DialogProps = Omit<HTMLAttributes, keyof DialogOptions> & DialogOptions

export interface DialogEmits {
  'update:open': [value: boolean]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
}

export interface DialogSlotProps {
  open: boolean
  close: () => void
}

export interface DialogTitleSlotProps extends DialogSlotProps {
  title: string | undefined
}

export interface DialogDescriptionSlotProps extends DialogSlotProps {
  description: string | undefined
}

export interface DialogSlots {
  default?(): VNodeChild
  title?(props: DialogTitleSlotProps): VNodeChild
  description?(props: DialogDescriptionSlotProps): VNodeChild
  content?(props: DialogSlotProps): VNodeChild
  footer?(props: DialogSlotProps): VNodeChild
  close?(): VNodeChild
}
