import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const tooltipSides = ['top', 'right', 'bottom', 'left'] as const
export const tooltipAlignments = ['start', 'center', 'end'] as const
export const tooltipPositionStrategies = ['absolute', 'fixed'] as const

export type TooltipSide = (typeof tooltipSides)[number]
export type TooltipAlign = (typeof tooltipAlignments)[number]
export type TooltipPositionStrategy = (typeof tooltipPositionStrategies)[number]
export type TooltipAs = NonNullable<PrimitiveProps['as']>
export type TooltipPortalTarget = boolean | string | HTMLElement
export type TooltipCollisionPadding = number | Partial<Record<TooltipSide, number>>

export interface TooltipUI {
  base?: ModeKitClassValue
  arrow?: ModeKitClassValue
}

export interface TooltipStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<TooltipUI, 'base'>
}

export interface TooltipOptions {
  as?: TooltipAs
  open?: boolean
  defaultOpen?: boolean
  delayDuration?: number
  disableHoverableContent?: boolean
  disableClosingTrigger?: boolean
  disabled?: boolean
  ignoreNonKeyboardFocus?: boolean
  side?: TooltipSide
  align?: TooltipAlign
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: TooltipCollisionPadding
  hideWhenDetached?: boolean
  positionStrategy?: TooltipPositionStrategy
  arrow?: boolean
  portal?: TooltipPortalTarget
  ui?: TooltipUI
}

export type TooltipProps = Omit<HTMLAttributes, keyof TooltipOptions> & TooltipOptions

export interface TooltipEmits {
  'update:open': [value: boolean]
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
}

export interface TooltipSlotProps {
  open: boolean
}

export interface TooltipSlots {
  default?(): VNodeChild
  content?(props: TooltipSlotProps): VNodeChild
  arrow?(): VNodeChild
}

export interface TooltipProviderOptions {
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  disableClosingTrigger?: boolean
  disabled?: boolean
  ignoreNonKeyboardFocus?: boolean
}

export type TooltipProviderProps = TooltipProviderOptions

export interface TooltipProviderSlots {
  default?(): VNodeChild
}
