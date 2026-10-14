import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  CaptionSize,
  CaptionStyleConfig,
  CaptionVariant,
  EllipsisLines,
  EllipsisTextStyleConfig,
  HeadlineSize,
  HeadlineStyleConfig,
  HeadlineVariant,
  InlineTextSize,
  LinkStyleConfig,
  LinkVariant,
  MarkStyleConfig,
  MarkVariant,
  ParagraphStyleConfig,
  ParagraphVariant,
  TextSize,
  TextStyleConfig,
  TextVariant,
  TypographyAlign,
  TypographyUI,
  TypographyWeight,
} from '../types.js'

const weightClasses: Record<TypographyWeight, string> = {
  inherit: 'mk:font-[inherit]',
  normal: 'mk:font-normal',
  medium: 'mk:font-medium',
  semibold: 'mk:font-semibold',
  bold: 'mk:font-bold',
}
const alignClasses: Record<TypographyAlign, string> = {
  inherit: 'mk:[text-align:inherit]',
  left: 'mk:text-left',
  center: 'mk:text-center',
  right: 'mk:text-right',
  justify: 'mk:text-justify',
}
const textSizeClasses: Record<TextSize, string> = {
  xs: 'mk:text-xs',
  sm: 'mk:text-sm',
  md: 'mk:text-base',
  lg: 'mk:text-lg',
  xl: 'mk:text-xl',
}
const paragraphSizeClasses: Record<TextSize, string> = {
  xs: 'mk:text-xs mk:leading-5',
  sm: 'mk:text-sm mk:leading-6',
  md: 'mk:text-base mk:leading-7',
  lg: 'mk:text-lg mk:leading-8',
  xl: 'mk:text-xl mk:leading-9',
}
const inlineSizeClasses: Record<InlineTextSize, string> = {
  inherit: 'mk:text-[length:inherit]',
  ...textSizeClasses,
}
const headlineSizeClasses: Record<HeadlineSize, string> = {
  xs: 'mk:text-xs',
  sm: 'mk:text-sm',
  md: 'mk:text-base',
  lg: 'mk:text-lg',
  xl: 'mk:text-xl',
  '2xl': 'mk:text-2xl',
  '3xl': 'mk:text-3xl',
  '4xl': 'mk:text-4xl',
  '5xl': 'mk:text-5xl',
  '6xl': 'mk:text-6xl',
  '7xl': 'mk:text-7xl',
  '8xl': 'mk:text-8xl',
  '9xl': 'mk:text-9xl',
}
const captionSizeClasses: Record<CaptionSize, string> = {
  xs: 'mk:text-[0.6875rem]',
  sm: 'mk:text-xs',
  md: 'mk:text-sm',
}

const headlineRecipe = cva('mk-headline mk:min-w-0', {
  variants: {
    variant: {
      default: 'mk:leading-tight mk:tracking-tight',
      display: 'mk:leading-none mk:tracking-[-0.035em]',
    },
  },
})
const textRecipe = cva('mk-text mk:min-w-0', {
  variants: {
    variant: {
      default: 'mk:leading-normal',
      label: 'mk:leading-tight mk:tracking-[-0.01em]',
    },
  },
})
const paragraphRecipe = cva('mk-paragraph mk:min-w-0', {
  variants: {
    variant: {
      default: '',
      lead: 'mk:leading-relaxed mk:tracking-[-0.01em]',
    },
  },
})
const captionRecipe = cva('mk-caption mk:min-w-0 mk:leading-tight', {
  variants: {
    variant: {
      default: '',
      uppercase: 'mk:uppercase mk:tracking-wider',
    },
  },
})
const ellipsisRecipe = cva('mk-ellipsis-text mk:min-w-0 mk:overflow-hidden', {
  variants: {
    lines: {
      1: 'mk:truncate',
      2: 'mk:[display:-webkit-box] mk:[-webkit-box-orient:vertical] mk:[-webkit-line-clamp:2]',
      3: 'mk:[display:-webkit-box] mk:[-webkit-box-orient:vertical] mk:[-webkit-line-clamp:3]',
      4: 'mk:[display:-webkit-box] mk:[-webkit-box-orient:vertical] mk:[-webkit-line-clamp:4]',
    },
  },
})
const markRecipe = cva('mk-mark mk:box-decoration-clone mk:rounded-sm mk:px-1 mk:py-0.5', {
  variants: {
    variant: {
      soft: '',
      solid: '',
      outline: 'mk:border mk:border-solid mk:bg-transparent',
    },
  },
})
const linkRecipe = cva(
  'mk-link mk:rounded-sm mk:outline-none mk:transition-colors mk:focus-visible:outline-2 mk:focus-visible:outline-offset-2 mk:focus-visible:outline-current',
  {
    variants: {
      variant: {
        underline: 'mk:underline mk:decoration-1 mk:underline-offset-4',
        hover: 'mk:no-underline mk:hover:underline mk:hover:underline-offset-4',
        plain: 'mk:no-underline',
      },
    },
  },
)

interface SharedOptions<S, C> {
  size: S
  primary: boolean
  weight: TypographyWeight
  align: TypographyAlign
  config?: C | undefined
  ui?: TypographyUI | undefined
  className?: ModeKitClassValue
}

function sharedClasses<S extends PropertyKey>(
  options: SharedOptions<
    S,
    {
      base?: ModeKitClassValue
      variants?: {
        size?: Partial<Record<S, ModeKitClassValue>>
        primary?: Partial<Record<'true' | 'false', ModeKitClassValue>>
        weight?: Partial<Record<TypographyWeight, ModeKitClassValue>>
        align?: Partial<Record<TypographyAlign, ModeKitClassValue>>
      }
    }
  >,
  sizes: Record<S, string>,
  neutralClass: string,
): ModeKitClassValue[] {
  const { size, primary, weight, align, config } = options
  const primaryKey = String(primary) as 'true' | 'false'
  return [
    sizes[size],
    primary ? 'mk:text-primary' : neutralClass,
    weightClasses[weight],
    alignClasses[align],
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.primary?.[primaryKey],
    config?.variants?.weight?.[weight],
    config?.variants?.align?.[align],
  ]
}

export function getHeadlineClasses(
  options: SharedOptions<HeadlineSize, HeadlineStyleConfig> & { variant: HeadlineVariant },
): string {
  return cn(
    ...sharedClasses(options, headlineSizeClasses, 'mk:text-neutral-800 mk:dark:text-neutral-200'),
    headlineRecipe({ variant: options.variant }),
    options.config?.variants?.variant?.[options.variant],
    options.ui?.base,
    options.className,
  )
}
export function getTextClasses(
  options: SharedOptions<TextSize, TextStyleConfig> & { variant: TextVariant },
): string {
  return cn(
    ...sharedClasses(options, textSizeClasses, 'mk:text-neutral-500'),
    textRecipe({ variant: options.variant }),
    options.config?.variants?.variant?.[options.variant],
    options.ui?.base,
    options.className,
  )
}
export function getParagraphClasses(
  options: SharedOptions<TextSize, ParagraphStyleConfig> & { variant: ParagraphVariant },
): string {
  return cn(
    ...sharedClasses(options, paragraphSizeClasses, 'mk:text-neutral-500'),
    paragraphRecipe({ variant: options.variant }),
    options.config?.variants?.variant?.[options.variant],
    options.ui?.base,
    options.className,
  )
}
export function getCaptionClasses(
  options: SharedOptions<CaptionSize, CaptionStyleConfig> & { variant: CaptionVariant },
): string {
  return cn(
    ...sharedClasses(options, captionSizeClasses, 'mk:text-neutral-500'),
    captionRecipe({ variant: options.variant }),
    options.config?.variants?.variant?.[options.variant],
    options.ui?.base,
    options.className,
  )
}
export function getEllipsisTextClasses(options: {
  lines: EllipsisLines
  config?: EllipsisTextStyleConfig | undefined
  ui?: TypographyUI | undefined
  className?: ModeKitClassValue
}): string {
  return cn(
    ellipsisRecipe({ lines: options.lines }),
    options.config?.base,
    options.config?.variants?.lines?.[String(options.lines) as `${EllipsisLines}`],
    options.ui?.base,
    options.className,
  )
}
export function getMarkClasses(options: {
  size: InlineTextSize
  primary: boolean
  variant: MarkVariant
  config?: MarkStyleConfig | undefined
  ui?: TypographyUI | undefined
  className?: ModeKitClassValue
}): string {
  const { size, primary, variant, config, ui, className } = options
  const primaryKey = String(primary) as 'true' | 'false'
  const treatment = primary
    ? {
        soft: 'mk:bg-primary/10 mk:text-primary',
        solid: 'mk:bg-primary mk:text-primary-foreground',
        outline: 'mk:border-primary mk:text-primary',
      }[variant]
    : {
        soft: 'mk:bg-neutral-100 mk:dark:bg-neutral-800',
        solid: 'mk:bg-neutral-800 mk:text-white mk:dark:bg-neutral-200 mk:dark:text-neutral-800',
        outline: 'mk:border-neutral-300 mk:dark:border-neutral-700',
      }[variant]
  return cn(
    markRecipe({ variant }),
    inlineSizeClasses[size],
    treatment,
    config?.base,
    config?.variants?.primary?.[primaryKey],
    config?.variants?.variant?.[variant],
    ui?.base,
    className,
  )
}
export function getLinkClasses(options: {
  size: InlineTextSize
  primary: boolean
  weight: TypographyWeight
  variant: LinkVariant
  config?: LinkStyleConfig | undefined
  ui?: TypographyUI | undefined
  className?: ModeKitClassValue
}): string {
  const { size, primary, weight, variant, config, ui, className } = options
  const primaryKey = String(primary) as 'true' | 'false'
  return cn(
    linkRecipe({ variant }),
    inlineSizeClasses[size],
    primary
      ? 'mk:text-primary mk:hover:opacity-80'
      : 'mk:text-neutral-500 mk:hover:text-neutral-800 mk:dark:hover:text-neutral-200',
    weightClasses[weight],
    config?.base,
    config?.variants?.size?.[size],
    config?.variants?.primary?.[primaryKey],
    config?.variants?.weight?.[weight],
    config?.variants?.variant?.[variant],
    ui?.base,
    className,
  )
}
