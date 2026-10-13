import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import { modeKitColors } from '../../colors.js'
import type { ModeKitColor } from '../../colors.js'
import type { ModeKitClassValue } from '../../types/classes.js'

export const calloutColors = modeKitColors
export const calloutVariants = ['solid', 'soft', 'outline'] as const
export const calloutSizes = ['sm', 'md', 'lg'] as const

export type CalloutColor = ModeKitColor
export type CalloutVariant = (typeof calloutVariants)[number]
export type CalloutSize = (typeof calloutSizes)[number]
export type CalloutAs = NonNullable<PrimitiveProps['as']>
export type CalloutSlot = 'icon' | 'content' | 'title' | 'description' | 'actions' | 'close'

export interface CalloutUI {
  base?: ModeKitClassValue
  icon?: ModeKitClassValue
  content?: ModeKitClassValue
  title?: ModeKitClassValue
  description?: ModeKitClassValue
  actions?: ModeKitClassValue
  close?: ModeKitClassValue
}

export interface CalloutCompoundVariant {
  color?: CalloutColor | readonly CalloutColor[]
  variant?: CalloutVariant | readonly CalloutVariant[]
  size?: CalloutSize | readonly CalloutSize[]
  class: ModeKitClassValue
}

export interface CalloutStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<CalloutUI, 'base'>
  variants?: {
    color?: Partial<Record<CalloutColor, ModeKitClassValue>>
    variant?: Partial<Record<CalloutVariant, ModeKitClassValue>>
    size?: Partial<Record<CalloutSize, ModeKitClassValue>>
  }
  compoundVariants?: readonly CalloutCompoundVariant[]
  defaultVariants?: {
    color?: CalloutColor
    variant?: CalloutVariant
    size?: CalloutSize
  }
}

export interface CalloutOptions {
  as?: CalloutAs
  color?: CalloutColor
  variant?: CalloutVariant
  size?: CalloutSize
  title?: string
  dismissible?: boolean
  dismissLabel?: string
  ui?: CalloutUI
}

export type CalloutProps = Omit<HTMLAttributes, keyof CalloutOptions> & CalloutOptions

export interface CalloutEmits {
  close: [event: MouseEvent]
}

export interface CalloutTitleSlotProps {
  title: string | undefined
}

export interface CalloutCloseSlotProps {
  label: string
}

export interface CalloutSlots {
  icon?(): VNodeChild
  title?(props: CalloutTitleSlotProps): VNodeChild
  default?(): VNodeChild
  actions?(): VNodeChild
  close?(props: CalloutCloseSlotProps): VNodeChild
}
