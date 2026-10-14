import { cva } from 'class-variance-authority'

import type { ModeKitClassValue } from '../../../types/classes.js'
import { cn } from '../../../utils/cn.js'
import type { SpacingStyleConfig, SpacingUI } from '../types.js'

const spacingStyles = cva('mk-spacing mk:relative mk:block mk:shrink-0 mk:box-border')

interface SpacingClassOptions {
  config?: SpacingStyleConfig | undefined
  ui?: SpacingUI | undefined
  className?: ModeKitClassValue
}

export function getSpacingClasses({ config, ui, className }: SpacingClassOptions): string {
  return cn(spacingStyles(), config?.base, ui?.base, className)
}
