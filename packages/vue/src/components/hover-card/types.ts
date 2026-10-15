import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const hoverCardSides = ['top', 'right', 'bottom', 'left'] as const
export const hoverCardAlignments = ['start', 'center', 'end'] as const
export const hoverCardPositionStrategies = ['absolute', 'fixed'] as const

export type HoverCardSide = (typeof hoverCardSides)[number]
export type HoverCardAlign = (typeof hoverCardAlignments)[number]
export type HoverCardPositionStrategy = (typeof hoverCardPositionStrategies)[number]
export type HoverCardAs = NonNullable<PrimitiveProps['as']>
export type HoverCardPortalTarget = boolean | string | HTMLElement
export type HoverCardCollisionPadding = number | Partial<Record<HoverCardSide, number>>

export interface HoverCardUI {
  base?: ModeKitClassValue
  arrow?: ModeKitClassValue
}

export interface HoverCardStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<HoverCardUI, 'base'>
}

export interface HoverCardOptions {
  as?: HoverCardAs
  open?: boolean
  defaultOpen?: boolean
  openDelay?: number
  closeDelay?: number
  enableTouch?: boolean
  side?: HoverCardSide
  align?: HoverCardAlign
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: HoverCardCollisionPadding
  hideWhenDetached?: boolean
  positionStrategy?: HoverCardPositionStrategy
  arrow?: boolean
  portal?: HoverCardPortalTarget
  ui?: HoverCardUI
}

export type HoverCardProps = Omit<HTMLAttributes, keyof HoverCardOptions> & HoverCardOptions

export interface HoverCardEmits {
  'update:open': [value: boolean]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
}

export interface HoverCardSlotProps {
  open: boolean
}

export interface HoverCardSlots {
  default?(): VNodeChild
  content?(props: HoverCardSlotProps): VNodeChild
  arrow?(): VNodeChild
}
