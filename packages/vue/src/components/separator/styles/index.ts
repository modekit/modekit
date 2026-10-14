import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  SeparatorCompoundVariant,
  SeparatorOrientation,
  SeparatorPosition,
  SeparatorSize,
  SeparatorSlot,
  SeparatorStyleConfig,
  SeparatorType,
  SeparatorUI,
} from '../types.js'

const separatorStyles = cva('mk-separator mk:box-border mk:flex mk:min-w-0 mk:shrink-0', {
  variants: {
    orientation: {
      horizontal: 'mk:w-full mk:items-center',
      vertical: 'mk:min-h-8 mk:flex-col mk:items-center mk:self-stretch',
    },
    size: {
      sm: 'mk:gap-2',
      md: 'mk:gap-3',
      lg: 'mk:gap-4',
    },
    type: {
      solid: '',
      dashed: '',
      dotted: '',
    },
    position: {
      start: '',
      center: '',
      end: '',
    },
    primary: {
      true: '',
      false: '',
    },
  },
})

const separatorSlotStyles = {
  line: cva(
    'mk-separator__line mk:box-border mk:block mk:min-h-0 mk:min-w-0 mk:flex-1 mk:border-0',
    {
      variants: {
        orientation: {
          horizontal: '',
          vertical: '',
        },
        size: {
          sm: '',
          md: '',
          lg: '',
        },
        type: {
          solid: 'mk:border-solid',
          dashed: 'mk:border-dashed',
          dotted: 'mk:border-dotted',
        },
        primary: {
          true: 'mk:border-primary',
          false: 'mk:border-neutral-200 mk:dark:border-neutral-700',
        },
      },
      compoundVariants: [
        { orientation: 'horizontal', size: 'sm', class: 'mk:border-t' },
        { orientation: 'horizontal', size: 'md', class: 'mk:border-t-2' },
        { orientation: 'horizontal', size: 'lg', class: 'mk:border-t-4' },
        { orientation: 'vertical', size: 'sm', class: 'mk:border-l' },
        { orientation: 'vertical', size: 'md', class: 'mk:border-l-2' },
        { orientation: 'vertical', size: 'lg', class: 'mk:border-l-4' },
      ],
    },
  ),
  content: cva(
    'mk-separator__content mk:inline-flex mk:shrink-0 mk:items-center mk:justify-center',
    {
      variants: {
        size: {
          sm: 'mk:gap-1',
          md: 'mk:gap-1.5',
          lg: 'mk:gap-2',
        },
        primary: {
          true: 'mk:text-primary',
          false: 'mk:text-neutral-600 mk:dark:text-neutral-400',
        },
      },
    },
  ),
  icon: cva(
    'mk-separator__icon mk:flex mk:shrink-0 mk:items-center mk:justify-center mk:[&>svg]:shrink-0',
    {
      variants: {
        size: {
          sm: 'mk:size-3.5 mk:[&>svg]:size-3.5',
          md: 'mk:size-4 mk:[&>svg]:size-4',
          lg: 'mk:size-5 mk:[&>svg]:size-5',
        },
      },
    },
  ),
  label: cva('mk-separator__label mk:whitespace-nowrap'),
} as const

interface SeparatorClassOptions {
  primary: boolean
  size: SeparatorSize
  type: SeparatorType
  orientation: SeparatorOrientation
  position: SeparatorPosition
  config?: SeparatorStyleConfig | undefined
  ui?: SeparatorUI | undefined
  className?: ModeKitClassValue
}

function matches<T extends string | boolean>(
  expected: T | readonly T[] | undefined,
  actual: T,
): boolean {
  return (
    expected === undefined ||
    (Array.isArray(expected) ? (expected as readonly T[]).includes(actual) : expected === actual)
  )
}

function resolveCompoundClasses(
  compoundVariants: readonly SeparatorCompoundVariant[] | undefined,
  options: Pick<SeparatorClassOptions, 'primary' | 'size' | 'type' | 'orientation' | 'position'>,
): ModeKitClassValue[] {
  return (
    compoundVariants
      ?.filter(
        (compound) =>
          matches(compound.primary, options.primary) &&
          matches(compound.size, options.size) &&
          matches(compound.type, options.type) &&
          matches(compound.orientation, options.orientation) &&
          matches(compound.position, options.position),
      )
      .map((compound) => compound.class) ?? []
  )
}

export function getSeparatorClasses(options: SeparatorClassOptions): string {
  const { primary, size, type, orientation, position, config, ui, className } = options

  return cn(
    separatorStyles({ primary, size, type, orientation, position }),
    config?.base,
    config?.variants?.primary?.[String(primary) as 'true' | 'false'],
    config?.variants?.size?.[size],
    config?.variants?.type?.[type],
    config?.variants?.orientation?.[orientation],
    config?.variants?.position?.[position],
    resolveCompoundClasses(config?.compoundVariants, options),
    ui?.base,
    className,
  )
}

interface SeparatorSlotClassOptions {
  slot: SeparatorSlot
  primary: boolean
  size: SeparatorSize
  type: SeparatorType
  orientation: SeparatorOrientation
  config?: SeparatorStyleConfig | undefined
  ui?: SeparatorUI | undefined
}

export function getSeparatorSlotClasses({
  slot,
  primary,
  size,
  type,
  orientation,
  config,
  ui,
}: SeparatorSlotClassOptions): string {
  const builtIn =
    slot === 'line'
      ? separatorSlotStyles.line({ primary, size, type, orientation })
      : slot === 'content'
        ? separatorSlotStyles.content({ primary, size })
        : separatorSlotStyles[slot]({ size })

  return cn(builtIn, config?.slots?.[slot], ui?.[slot])
}
