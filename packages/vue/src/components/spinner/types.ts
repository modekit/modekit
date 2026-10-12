import type { HTMLAttributes } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const spinnerSizes = ['xs', 'sm', 'md', 'lg'] as const

export type SpinnerSize = (typeof spinnerSizes)[number]

export interface SpinnerUI {
  base?: ModeKitClassValue
}

export interface SpinnerStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    size?: Partial<Record<SpinnerSize, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: SpinnerSize
  }
}

export interface SpinnerOptions {
  size?: SpinnerSize
  ui?: SpinnerUI
}

export type SpinnerProps = Omit<HTMLAttributes, keyof SpinnerOptions> & SpinnerOptions
