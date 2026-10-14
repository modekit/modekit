import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { GridAlign, GridDisplay, GridStyleConfig, GridUI } from '../types.js'

const gridStyles = cva('mk-grid', {
  variants: {
    align: {
      start: 'mk:items-start',
      center: 'mk:items-center',
      baseline: 'mk:items-baseline',
      end: 'mk:items-end',
      stretch: 'mk:items-stretch',
    },
    display: {
      none: 'mk:hidden',
      grid: 'mk:grid',
      'inline-grid': 'mk:inline-grid',
    },
  },
})

interface GridClassOptions {
  align: GridAlign
  config?: GridStyleConfig | undefined
  display: GridDisplay
  ui?: GridUI | undefined
  className?: ModeKitClassValue
}

export function getGridClasses({
  align,
  config,
  display,
  ui,
  className,
}: GridClassOptions): string {
  return cn(
    gridStyles({ align, display }),
    config?.base,
    config?.variants?.align?.[align],
    config?.variants?.display?.[display],
    ui?.base,
    className,
  )
}
