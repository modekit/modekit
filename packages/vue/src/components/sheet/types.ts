import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const sheetSides = ['top', 'right', 'bottom', 'left'] as const
export const sheetSizes = ['sm', 'md', 'lg', 'xl'] as const
export const sheetVariants = ['edge', 'inset'] as const

export type SheetSide = (typeof sheetSides)[number]
export type SheetSize = (typeof sheetSizes)[number]
export type SheetVariant = (typeof sheetVariants)[number]
export type SheetAs = NonNullable<PrimitiveProps['as']>
export type SheetPortalTarget = boolean | string | HTMLElement
export type SheetCloseReason =
  'swipe' | 'escape-key' | 'outside-press' | 'click' | 'cancel' | 'trigger-press' | 'close-press'

export interface SheetUI {
  base?: ModeKitClassValue
  overlay?: ModeKitClassValue
  handle?: ModeKitClassValue
  container?: ModeKitClassValue
  header?: ModeKitClassValue
  wrapper?: ModeKitClassValue
  title?: ModeKitClassValue
  description?: ModeKitClassValue
  actions?: ModeKitClassValue
  body?: ModeKitClassValue
  footer?: ModeKitClassValue
  close?: ModeKitClassValue
}

export interface SheetStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    side?: Partial<Record<SheetSide, ModeKitClassValue>>
    size?: Partial<Record<SheetSize, ModeKitClassValue>>
    variant?: Partial<Record<SheetVariant, ModeKitClassValue>>
  }
  slots?: Omit<SheetUI, 'base'>
  defaultVariants?: {
    side?: SheetSide
    size?: SheetSize
    variant?: SheetVariant
  }
}

/**
 * @alpha Built on Reka UI's alpha Drawer primitive. The Sheet API may change before stabilization.
 */
export interface SheetOptions {
  as?: SheetAs
  title?: string
  description?: string
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  dismissible?: boolean
  unmountOnHide?: boolean
  side?: SheetSide
  size?: SheetSize
  variant?: SheetVariant
  handle?: boolean
  overlay?: boolean
  closeButton?: boolean
  closeLabel?: string
  initialFocus?: boolean | HTMLElement | null
  finalFocus?: boolean | HTMLElement | null
  portal?: SheetPortalTarget
  ui?: SheetUI
}

/** @alpha */
export type SheetProps = Omit<HTMLAttributes, keyof SheetOptions> & SheetOptions

/** @alpha */
export interface SheetEmits {
  'update:open': [value: boolean]
  afterOpen: []
  afterClose: []
  closePrevented: [reason: SheetCloseReason | undefined]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
}

export interface SheetSlotProps {
  open: boolean
  close: () => void
}

export interface SheetTitleSlotProps extends SheetSlotProps {
  title: string | undefined
}

export interface SheetDescriptionSlotProps extends SheetSlotProps {
  description: string | undefined
}

/** @alpha */
export interface SheetSlots {
  default?(): VNodeChild
  title?(props: SheetTitleSlotProps): VNodeChild
  description?(props: SheetDescriptionSlotProps): VNodeChild
  actions?(props: SheetSlotProps): VNodeChild
  content?(props: SheetSlotProps): VNodeChild
  footer?(props: SheetSlotProps): VNodeChild
  close?(): VNodeChild
}
