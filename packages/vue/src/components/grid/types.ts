import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const gridAlignments = ['start', 'center', 'baseline', 'end', 'stretch'] as const
export const gridDisplays = ['none', 'grid', 'inline-grid'] as const
export const gridSpacePresets = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'] as const
export const gridSpecialMargins = ['none', 'auto', 'auto-inline', 'auto-block'] as const

export type GridAlign = (typeof gridAlignments)[number]
export type GridDisplay = (typeof gridDisplays)[number]
export type GridSpacePreset = (typeof gridSpacePresets)[number]
export type GridSpecialMargin = (typeof gridSpecialMargins)[number]
export type GridAs = NonNullable<PrimitiveProps['as']>

export type GridCSSGlobalValue = 'inherit' | 'initial' | 'unset'
export type GridIntrinsicSize = 'auto' | 'max-content' | 'min-content' | 'fit-content'
export type GridLength = GridSpacePreset | GridCSSGlobalValue | number | (string & {})
export type GridSize = GridLength | GridIntrinsicSize
export type GridInset = GridLength | 'auto'
export type GridOverflow = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto' | GridCSSGlobalValue
export type GridPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
export type GridSelfAlignment = GridAlign
export type GridGapValue = GridSpacePreset | number
export type GridGap = GridGapValue | readonly [row: GridGapValue, column: GridGapValue]
export type GridMargin = GridSpecialMargin | GridLength
export type GridPadding = GridLength | 'system'
export type GridFlexFactor = number | GridCSSGlobalValue
export type GridFlexBasis = GridSize | 'content'

export interface GridLayoutOptions {
  alignSelf?: GridSelfAlignment
  blockSize?: GridSize
  flexBasis?: GridFlexBasis
  flexGrow?: GridFlexFactor
  flexShrink?: GridFlexFactor
  inlineSize?: GridSize
  inset?: GridInset
  insetBlock?: GridInset
  insetBlockEnd?: GridInset
  insetBlockStart?: GridInset
  insetInline?: GridInset
  insetInlineEnd?: GridInset
  insetInlineStart?: GridInset
  justifySelf?: GridSelfAlignment
  margin?: GridMargin
  marginBlock?: GridLength
  marginBlockEnd?: GridLength
  marginBlockStart?: GridLength
  marginInline?: GridLength
  marginInlineEnd?: GridLength
  marginInlineStart?: GridLength
  maxBlockSize?: GridSize
  maxInlineSize?: Exclude<GridSize, 'auto'>
  minBlockSize?: GridSize
  minInlineSize?: Exclude<GridSize, 'auto'>
  overflow?: GridOverflow
  overflowBlock?: GridOverflow
  overflowInline?: GridOverflow
  padding?: GridPadding
  paddingBlock?: GridPadding
  paddingBlockEnd?: GridPadding
  paddingBlockStart?: GridPadding
  paddingInline?: GridPadding
  paddingInlineEnd?: GridPadding
  paddingInlineStart?: GridPadding
  position?: GridPosition
}

export interface GridUI {
  base?: ModeKitClassValue
}

export interface GridStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    align?: Partial<Record<GridAlign, ModeKitClassValue>>
    display?: Partial<Record<GridDisplay, ModeKitClassValue>>
  }
  defaultVariants?: {
    align?: GridAlign
    display?: GridDisplay
  }
}

export interface GridOptions extends GridLayoutOptions {
  align?: GridAlign
  as?: GridAs
  columns?: number
  display?: GridDisplay
  gap?: GridGap
  minColWidth?: number
  ui?: GridUI
}

export type GridProps = Omit<HTMLAttributes, keyof GridOptions> & GridOptions

export interface GridSlots {
  default?(): VNodeChild
}
