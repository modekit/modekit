import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const tabsVariants = ['line', 'pill'] as const
export const tabsSizes = ['sm', 'md', 'lg'] as const
export const tabsActivationModes = ['automatic', 'manual'] as const

export type TabsVariant = (typeof tabsVariants)[number]
export type TabsSize = (typeof tabsSizes)[number]
export type TabsActivationMode = (typeof tabsActivationModes)[number]
export type TabsValue = string | number

export interface TabsItem {
  value: TabsValue
  label: string
  disabled?: boolean
}

export interface TabsUI {
  base?: ModeKitClassValue
  list?: ModeKitClassValue
  trigger?: ModeKitClassValue
  label?: ModeKitClassValue
  leading?: ModeKitClassValue
  trailing?: ModeKitClassValue
  content?: ModeKitClassValue
}

export interface TabsStyleConfig {
  base?: ModeKitClassValue
  slots?: Omit<TabsUI, 'base'>
  variants?: {
    variant?: Partial<Record<TabsVariant, ModeKitClassValue>>
    size?: Partial<Record<TabsSize, ModeKitClassValue>>
  }
  defaultVariants?: {
    variant?: TabsVariant
    size?: TabsSize
  }
}

export interface TabsOptions {
  items: readonly TabsItem[]
  modelValue?: TabsValue
  defaultValue?: TabsValue
  variant?: TabsVariant
  size?: TabsSize
  activationMode?: TabsActivationMode
  loop?: boolean
  unmountOnHide?: boolean
  ui?: TabsUI
}

export type TabsProps = Omit<HTMLAttributes, keyof TabsOptions> & TabsOptions

export interface TabsEmits {
  'update:modelValue': [value: TabsValue]
}

export interface TabsSlotProps {
  item: TabsItem
  active: boolean
}

export interface TabsSlots {
  tab?(props: TabsSlotProps): VNodeChild
  leading?(props: TabsSlotProps): VNodeChild
  trailing?(props: TabsSlotProps): VNodeChild
  content?(props: TabsSlotProps): VNodeChild
}
