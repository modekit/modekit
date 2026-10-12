import { cx } from 'class-variance-authority'
import { extendTailwindMerge, twMerge } from 'tailwind-merge'

const mergeModeKitClasses = extendTailwindMerge({ prefix: 'mk' })

export function cn(...inputs: Parameters<typeof cx>): string {
  return twMerge(mergeModeKitClasses(cx(inputs)))
}
