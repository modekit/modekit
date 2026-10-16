import type { ButtonHTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const switchSizes = ['sm', 'md', 'lg'] as const
export const switchVariants = ['default', 'card'] as const
export const switchAlignments = ['left', 'right'] as const

export type SwitchSize = (typeof switchSizes)[number]
export type SwitchVariant = (typeof switchVariants)[number]
export type SwitchAlignment = (typeof switchAlignments)[number]

export interface SwitchUI {
  base?: ModeKitClassValue
  control?: ModeKitClassValue
  thumb?: ModeKitClassValue
  icon?: ModeKitClassValue
  loader?: ModeKitClassValue
  content?: ModeKitClassValue
  label?: ModeKitClassValue
  description?: ModeKitClassValue
}

export interface SwitchStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<SwitchUI, 'base'>
  variants?: {
    size?: Partial<Record<SwitchSize, ModeKitClassValue>>
    variant?: Partial<Record<SwitchVariant, ModeKitClassValue>>
    align?: Partial<Record<SwitchAlignment, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: SwitchSize
    variant?: SwitchVariant
    align?: SwitchAlignment
  }
}

export interface SwitchOptions {
  modelValue?: boolean
  defaultValue?: boolean
  label?: string
  description?: string
  size?: SwitchSize
  variant?: SwitchVariant
  align?: SwitchAlignment
  disabled?: boolean
  loading?: boolean
  required?: boolean
  name?: string
  value?: string
  ui?: SwitchUI
}

export type SwitchProps = Omit<ButtonHTMLAttributes, keyof SwitchOptions> & SwitchOptions

export interface SwitchEmits {
  'update:modelValue': [value: boolean]
}

export interface SwitchThumbSlotProps {
  checked: boolean
  modelValue: boolean
  loading: boolean
  disabled: boolean
  size: SwitchSize
}

export interface SwitchLabelSlotProps {
  label: string | undefined
}

export interface SwitchDescriptionSlotProps {
  description: string | undefined
}

export interface SwitchSlots {
  thumb?(props: SwitchThumbSlotProps): VNodeChild
  'checked-icon'?(props: SwitchThumbSlotProps): VNodeChild
  'unchecked-icon'?(props: SwitchThumbSlotProps): VNodeChild
  loader?(props: SwitchThumbSlotProps): VNodeChild
  label?(props: SwitchLabelSlotProps): VNodeChild
  description?(props: SwitchDescriptionSlotProps): VNodeChild
}
