import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const buttonGroupOrientations = ['horizontal', 'vertical'] as const

export type ButtonGroupOrientation = (typeof buttonGroupOrientations)[number]
export type ButtonGroupAs = NonNullable<PrimitiveProps['as']>

export interface ButtonGroupUI {
  base?: ModeKitClassValue
}

export interface ButtonGroupStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    orientation?: Partial<Record<ButtonGroupOrientation, ModeKitClassValue>>
  }
  defaultVariants?: {
    orientation?: ButtonGroupOrientation
  }
}

export interface ButtonGroupOptions {
  as?: ButtonGroupAs
  orientation?: ButtonGroupOrientation
  ui?: ButtonGroupUI
}

export type ButtonGroupProps = Omit<HTMLAttributes, keyof ButtonGroupOptions> & ButtonGroupOptions

export interface ButtonGroupSlots {
  default?(): VNodeChild
}
