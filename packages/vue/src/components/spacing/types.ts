import type { HTMLAttributes } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const spacingSizes = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'] as const
export const spacingOrientations = ['vertical', 'horizontal'] as const

export type SpacingPreset = (typeof spacingSizes)[number]
export type SpacingOrientation = (typeof spacingOrientations)[number]
export type SpacingCSSVariable = `--${string}` | `var(--${string})`
export type SpacingSize = SpacingPreset | SpacingCSSVariable | 'full' | number

export interface SpacingUI {
  base?: ModeKitClassValue
}

export interface SpacingStyleConfig {
  base?: ModeKitClassValue
}

export interface SpacingOptions {
  grow?: boolean
  orientation?: SpacingOrientation
  size?: SpacingSize
  ui?: SpacingUI
}

type SpacingLayoutProps = Omit<SpacingOptions, 'grow' | 'orientation' | 'size'> &
  (
    | {
        grow: true
        orientation?: never
        size?: never
      }
    | {
        grow?: false
        orientation?: SpacingOrientation
        size?: SpacingSize
      }
  )

export type SpacingProps = SpacingLayoutProps & Omit<HTMLAttributes, 'class' | 'style'>
