import type { AnchorHTMLAttributes, Component, HTMLAttributes, VNodeChild } from 'vue'

import type { ModeKitClassValue } from '../../types/classes.js'

export const typographyWeights = ['inherit', 'normal', 'medium', 'semibold', 'bold'] as const
export const typographyAlignments = ['inherit', 'left', 'center', 'right', 'justify'] as const
export const textSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export const headlineSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
export const headlineVariants = ['default', 'display'] as const
export const textVariants = ['default', 'label'] as const
export const paragraphVariants = ['default', 'lead'] as const
export const captionSizes = ['xs', 'sm', 'md'] as const
export const captionVariants = ['default', 'uppercase'] as const
export const inlineTextSizes = ['inherit', ...textSizes] as const
export const ellipsisLines = [1, 2, 3, 4] as const
export const markVariants = ['soft', 'solid', 'outline'] as const
export const linkVariants = ['underline', 'hover', 'plain'] as const

export type TypographyWeight = (typeof typographyWeights)[number]
export type TypographyAlign = (typeof typographyAlignments)[number]
export type TextSize = (typeof textSizes)[number]
export type HeadlineSize = (typeof headlineSizes)[number]
export type HeadlineVariant = (typeof headlineVariants)[number]
export type TextVariant = (typeof textVariants)[number]
export type ParagraphVariant = (typeof paragraphVariants)[number]
export type CaptionSize = (typeof captionSizes)[number]
export type CaptionVariant = (typeof captionVariants)[number]
export type InlineTextSize = (typeof inlineTextSizes)[number]
export type EllipsisLines = (typeof ellipsisLines)[number]
export type MarkVariant = (typeof markVariants)[number]
export type LinkVariant = (typeof linkVariants)[number]

export type HeadlineAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | Component
export type TextAs = 'span' | 'p' | 'div' | 'label' | 'mark' | Component
export type ParagraphAs = 'p' | 'div' | Component
export type CaptionAs = 'span' | 'p' | 'div' | Component
export type EllipsisTextAs = 'span' | 'p' | 'div' | Component
export type MarkAs = 'mark' | 'span' | Component
export type LinkAs = 'a' | Component

export interface TypographyUI {
  base?: ModeKitClassValue
}

interface SharedTypographyOptions<S> {
  size?: S
  primary?: boolean
  weight?: TypographyWeight
  align?: TypographyAlign
  ui?: TypographyUI
}

interface SharedTypographyStyleConfig<S> {
  base?: ModeKitClassValue
  variants?: {
    size?: Partial<Record<S & PropertyKey, ModeKitClassValue>>
    primary?: Partial<Record<'true' | 'false', ModeKitClassValue>>
    weight?: Partial<Record<TypographyWeight, ModeKitClassValue>>
    align?: Partial<Record<TypographyAlign, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: S
    primary?: boolean
    weight?: TypographyWeight
    align?: TypographyAlign
  }
}

export interface HeadlineOptions extends SharedTypographyOptions<HeadlineSize> {
  as?: HeadlineAs
  variant?: HeadlineVariant
}
export type HeadlineProps = Omit<HTMLAttributes, keyof HeadlineOptions | 'color'> & HeadlineOptions
export interface HeadlineStyleConfig extends SharedTypographyStyleConfig<HeadlineSize> {
  variants?: SharedTypographyStyleConfig<HeadlineSize>['variants'] & {
    variant?: Partial<Record<HeadlineVariant, ModeKitClassValue>>
  }
  defaultVariants?: SharedTypographyStyleConfig<HeadlineSize>['defaultVariants'] & {
    variant?: HeadlineVariant
  }
}

export interface TextOptions extends SharedTypographyOptions<TextSize> {
  as?: TextAs
  variant?: TextVariant
}
export type TextProps = Omit<HTMLAttributes, keyof TextOptions | 'color'> & TextOptions
export interface TextStyleConfig extends SharedTypographyStyleConfig<TextSize> {
  variants?: SharedTypographyStyleConfig<TextSize>['variants'] & {
    variant?: Partial<Record<TextVariant, ModeKitClassValue>>
  }
  defaultVariants?: SharedTypographyStyleConfig<TextSize>['defaultVariants'] & {
    variant?: TextVariant
  }
}

export interface ParagraphOptions extends SharedTypographyOptions<TextSize> {
  as?: ParagraphAs
  variant?: ParagraphVariant
}
export type ParagraphProps = Omit<HTMLAttributes, keyof ParagraphOptions | 'color'> &
  ParagraphOptions
export interface ParagraphStyleConfig extends SharedTypographyStyleConfig<TextSize> {
  variants?: SharedTypographyStyleConfig<TextSize>['variants'] & {
    variant?: Partial<Record<ParagraphVariant, ModeKitClassValue>>
  }
  defaultVariants?: SharedTypographyStyleConfig<TextSize>['defaultVariants'] & {
    variant?: ParagraphVariant
  }
}

export interface CaptionOptions extends SharedTypographyOptions<CaptionSize> {
  as?: CaptionAs
  variant?: CaptionVariant
}
export type CaptionProps = Omit<HTMLAttributes, keyof CaptionOptions | 'color'> & CaptionOptions
export interface CaptionStyleConfig extends SharedTypographyStyleConfig<CaptionSize> {
  variants?: SharedTypographyStyleConfig<CaptionSize>['variants'] & {
    variant?: Partial<Record<CaptionVariant, ModeKitClassValue>>
  }
  defaultVariants?: SharedTypographyStyleConfig<CaptionSize>['defaultVariants'] & {
    variant?: CaptionVariant
  }
}

export interface EllipsisTextOptions extends SharedTypographyOptions<TextSize> {
  as?: EllipsisTextAs
  lines?: EllipsisLines
}
export type EllipsisTextProps = Omit<HTMLAttributes, keyof EllipsisTextOptions | 'color'> &
  EllipsisTextOptions
export interface EllipsisTextStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    lines?: Partial<Record<`${EllipsisLines}`, ModeKitClassValue>>
  }
  defaultVariants?: {
    lines?: EllipsisLines
  }
}

export interface MarkOptions {
  as?: MarkAs
  size?: InlineTextSize
  primary?: boolean
  weight?: TypographyWeight
  variant?: MarkVariant
  ui?: TypographyUI
}
export type MarkProps = Omit<HTMLAttributes, keyof MarkOptions | 'color'> & MarkOptions
export interface MarkStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    primary?: Partial<Record<'true' | 'false', ModeKitClassValue>>
    variant?: Partial<Record<MarkVariant, ModeKitClassValue>>
  }
  defaultVariants?: {
    primary?: boolean
    variant?: MarkVariant
  }
}

export interface LinkOptions {
  as?: LinkAs
  size?: InlineTextSize
  primary?: boolean
  weight?: TypographyWeight
  variant?: LinkVariant
  ui?: TypographyUI
}
export type LinkProps = Omit<AnchorHTMLAttributes, keyof LinkOptions | 'color'> & LinkOptions
export interface LinkStyleConfig {
  base?: ModeKitClassValue
  variants?: {
    size?: Partial<Record<InlineTextSize, ModeKitClassValue>>
    primary?: Partial<Record<'true' | 'false', ModeKitClassValue>>
    weight?: Partial<Record<TypographyWeight, ModeKitClassValue>>
    variant?: Partial<Record<LinkVariant, ModeKitClassValue>>
  }
  defaultVariants?: {
    size?: InlineTextSize
    primary?: boolean
    weight?: TypographyWeight
    variant?: LinkVariant
  }
}

export interface TypographySlots {
  default?(): VNodeChild
}
