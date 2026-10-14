import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type {
  FlexAlign,
  FlexContentAlign,
  FlexDirection,
  FlexDisplay,
  FlexJustify,
  FlexStyleConfig,
  FlexUI,
  FlexWrap,
} from '../types.js'

const flexStyles = cva('mk-flex', {
  variants: {
    align: {
      start: 'mk:items-start',
      center: 'mk:items-center',
      baseline: 'mk:items-baseline',
      end: 'mk:items-end',
      stretch: 'mk:items-stretch',
    },
    alignContent: {
      start: 'mk:content-start',
      center: 'mk:content-center',
      end: 'mk:content-end',
      'space-between': 'mk:content-between',
      'space-around': 'mk:content-around',
      'space-evenly': 'mk:content-evenly',
      stretch: 'mk:content-stretch',
    },
    direction: {
      row: 'mk:flex-row',
      'row-reverse': 'mk:flex-row-reverse',
      column: 'mk:flex-col',
      'column-reverse': 'mk:flex-col-reverse',
    },
    display: {
      none: 'mk:hidden',
      flex: 'mk:flex',
      'inline-flex': 'mk:inline-flex',
    },
    justify: {
      start: 'mk:justify-start',
      center: 'mk:justify-center',
      end: 'mk:justify-end',
      'space-between': 'mk:justify-between',
      'space-around': 'mk:justify-around',
      'space-evenly': 'mk:justify-evenly',
    },
    wrap: {
      nowrap: 'mk:flex-nowrap',
      wrap: 'mk:flex-wrap',
      'wrap-reverse': 'mk:flex-wrap-reverse',
    },
  },
})

interface FlexClassOptions {
  align: FlexAlign
  alignContent: FlexContentAlign
  config?: FlexStyleConfig | undefined
  direction: FlexDirection
  display: FlexDisplay
  justify: FlexJustify
  ui?: FlexUI | undefined
  wrap: FlexWrap
  className?: ModeKitClassValue
}

export function getFlexClasses({
  align,
  alignContent,
  config,
  direction,
  display,
  justify,
  ui,
  wrap,
  className,
}: FlexClassOptions): string {
  return cn(
    flexStyles({ align, alignContent, direction, display, justify, wrap }),
    config?.base,
    config?.variants?.align?.[align],
    config?.variants?.alignContent?.[alignContent],
    config?.variants?.direction?.[direction],
    config?.variants?.display?.[display],
    config?.variants?.justify?.[justify],
    config?.variants?.wrap?.[wrap],
    ui?.base,
    className,
  )
}
