import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const cardVariants = ['shadow', 'muted', 'outline', 'plain'] as const
export const cardSizes = ['sm', 'md', 'lg'] as const
export const cardBodyTreatments = ['seamless', 'inset', 'flush'] as const

export type CardVariant = (typeof cardVariants)[number]
export type CardSize = (typeof cardSizes)[number]
export type CardBodyTreatment = (typeof cardBodyTreatments)[number]

export interface CardUI {
  base?: ModeKitClassValue
  header?: ModeKitClassValue
  headerContent?: ModeKitClassValue
  headerActions?: ModeKitClassValue
  body?: ModeKitClassValue
  footer?: ModeKitClassValue
}

export interface CardStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<CardUI, 'base'>
  variants?: {
    body?: Partial<Record<CardBodyTreatment, ModeKitClassValue>>
    variant?: Partial<Record<CardVariant, ModeKitClassValue>>
    size?: Partial<Record<CardSize, ModeKitClassValue>>
  }
  defaultVariants?: {
    body?: CardBodyTreatment
    variant?: CardVariant
    size?: CardSize
  }
}

export interface CardOptions {
  body?: CardBodyTreatment
  variant?: CardVariant
  size?: CardSize
  title?: string
  description?: string
  ui?: CardUI
}

export type CardProps = Omit<HTMLAttributes, keyof CardOptions> & CardOptions

export interface CardSlots {
  default?(): VNodeChild
  header?(): VNodeChild
  'header-actions'?(): VNodeChild
  footer?(): VNodeChild
}

export type CardEdgeAs = NonNullable<PrimitiveProps['as']>

export interface CardEdgeUI {
  base?: ModeKitClassValue
}

export interface CardEdgeStyleConfig {
  base?: ModeKitClassValue
}

export interface CardEdgeOptions {
  as?: CardEdgeAs
  ui?: CardEdgeUI
}

export type CardEdgeProps = Omit<HTMLAttributes, keyof CardEdgeOptions> & CardEdgeOptions

export interface CardEdgeSlots {
  default?(): VNodeChild
}
