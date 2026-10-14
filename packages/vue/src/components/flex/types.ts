import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const flexAlignments = ['start', 'center', 'baseline', 'end', 'stretch'] as const
export const flexContentAlignments = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
] as const
export const flexDirections = ['row', 'row-reverse', 'column', 'column-reverse'] as const
export const flexDisplays = ['none', 'flex', 'inline-flex'] as const
export const flexJustifications = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
] as const
export const flexSelfAlignments = ['auto', ...flexAlignments] as const
export const flexSpacePresets = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'] as const
export const flexWraps = ['nowrap', 'wrap', 'wrap-reverse'] as const

export type FlexAlign = (typeof flexAlignments)[number]
export type FlexAs = NonNullable<PrimitiveProps['as']>
export type FlexContentAlign = (typeof flexContentAlignments)[number]
export type FlexDirection = (typeof flexDirections)[number]
export type FlexDisplay = (typeof flexDisplays)[number]
export type FlexJustify = (typeof flexJustifications)[number]
export type FlexSelfAlign = (typeof flexSelfAlignments)[number]
export type FlexSpacePreset = (typeof flexSpacePresets)[number]
export type FlexWrap = (typeof flexWraps)[number]

export type FlexBasis =
  | FlexSpacePreset
  | 'auto'
  | 'content'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | number
  | (string & {})
export type FlexGapValue = FlexSpacePreset | number
export type FlexGap = FlexGapValue | readonly [row: FlexGapValue, column: FlexGapValue]
export type FlexShorthand =
  'initial' | 'auto' | 'none' | number | readonly [grow: number, shrink: number, basis: FlexBasis]

export interface FlexUI {
  base?: ModeKitClassValue
}

export interface FlexStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    align?: Partial<Record<FlexAlign, ModeKitClassValue>>
    alignContent?: Partial<Record<FlexContentAlign, ModeKitClassValue>>
    direction?: Partial<Record<FlexDirection, ModeKitClassValue>>
    display?: Partial<Record<FlexDisplay, ModeKitClassValue>>
    justify?: Partial<Record<FlexJustify, ModeKitClassValue>>
    wrap?: Partial<Record<FlexWrap, ModeKitClassValue>>
  }
  defaultVariants?: {
    align?: FlexAlign
    alignContent?: FlexContentAlign
    direction?: FlexDirection
    display?: FlexDisplay
    justify?: FlexJustify
    wrap?: FlexWrap
  }
}

export interface FlexOptions {
  align?: FlexAlign
  alignContent?: FlexContentAlign
  alignSelf?: FlexSelfAlign
  as?: FlexAs
  direction?: FlexDirection
  display?: FlexDisplay
  flex?: FlexShorthand
  flexBasis?: FlexBasis
  flexGrow?: number
  flexShrink?: number
  gap?: FlexGap
  justify?: FlexJustify
  order?: number
  ui?: FlexUI
  wrap?: FlexWrap
}

export type FlexProps = Omit<HTMLAttributes, keyof FlexOptions> & FlexOptions

export interface FlexSlots {
  default?(): VNodeChild
}
