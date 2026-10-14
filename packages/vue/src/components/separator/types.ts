import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const separatorSizes = ['sm', 'md', 'lg'] as const
export const separatorTypes = ['solid', 'dashed', 'dotted'] as const
export const separatorOrientations = ['horizontal', 'vertical'] as const
export const separatorPositions = ['start', 'center', 'end'] as const

export type SeparatorSize = (typeof separatorSizes)[number]
export type SeparatorType = (typeof separatorTypes)[number]
export type SeparatorOrientation = (typeof separatorOrientations)[number]
export type SeparatorPosition = (typeof separatorPositions)[number]
export type SeparatorAs = NonNullable<PrimitiveProps['as']>
export type SeparatorSlot = 'line' | 'content' | 'icon' | 'label'

export interface SeparatorUI {
  base?: ModeKitClassValue
  line?: ModeKitClassValue
  content?: ModeKitClassValue
  icon?: ModeKitClassValue
  label?: ModeKitClassValue
}

export interface SeparatorCompoundVariant {
  primary?: boolean | readonly boolean[]
  size?: SeparatorSize | readonly SeparatorSize[]
  type?: SeparatorType | readonly SeparatorType[]
  orientation?: SeparatorOrientation | readonly SeparatorOrientation[]
  position?: SeparatorPosition | readonly SeparatorPosition[]
  class: ModeKitClassValue
}

export interface SeparatorStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<SeparatorUI, 'base'>
  variants?: {
    primary?: Partial<Record<'true' | 'false', ModeKitClassValue>>
    size?: Partial<Record<SeparatorSize, ModeKitClassValue>>
    type?: Partial<Record<SeparatorType, ModeKitClassValue>>
    orientation?: Partial<Record<SeparatorOrientation, ModeKitClassValue>>
    position?: Partial<Record<SeparatorPosition, ModeKitClassValue>>
  }
  compoundVariants?: readonly SeparatorCompoundVariant[]
  defaultVariants?: {
    primary?: boolean
    size?: SeparatorSize
    type?: SeparatorType
    orientation?: SeparatorOrientation
    position?: SeparatorPosition
  }
}

export interface SeparatorOptions {
  as?: SeparatorAs
  label?: string
  primary?: boolean
  size?: SeparatorSize
  type?: SeparatorType
  orientation?: SeparatorOrientation
  position?: SeparatorPosition
  ui?: SeparatorUI
}

export type SeparatorProps = Omit<HTMLAttributes, keyof SeparatorOptions> & SeparatorOptions

export interface SeparatorSlots {
  icon?(): VNodeChild
}
