import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const popoverSides = ['top', 'right', 'bottom', 'left'] as const
export const popoverAlignments = ['start', 'center', 'end'] as const
export const popoverPositionStrategies = ['absolute', 'fixed'] as const

export type PopoverSide = (typeof popoverSides)[number]
export type PopoverAlign = (typeof popoverAlignments)[number]
export type PopoverPositionStrategy = (typeof popoverPositionStrategies)[number]
export type PopoverAs = NonNullable<PrimitiveProps['as']>
export type PopoverPortalTarget = boolean | string | HTMLElement
export type PopoverCollisionPadding = number | Partial<Record<PopoverSide, number>>

export interface PopoverUI {
  base?: ModeKitClassValue
  arrow?: ModeKitClassValue
}

export interface PopoverStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<PopoverUI, 'base'>
}

export interface PopoverOptions {
  as?: PopoverAs
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  dismissible?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: PopoverCollisionPadding
  hideWhenDetached?: boolean
  positionStrategy?: PopoverPositionStrategy
  arrow?: boolean
  portal?: PopoverPortalTarget
  ui?: PopoverUI
}

export type PopoverProps = Omit<HTMLAttributes, keyof PopoverOptions> & PopoverOptions

export interface PopoverEmits {
  'update:open': [value: boolean]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
}

export interface PopoverSlotProps {
  open: boolean
  close: () => void
}

export interface PopoverSlots {
  default?(): VNodeChild
  content?(props: PopoverSlotProps): VNodeChild
  arrow?(): VNodeChild
}
