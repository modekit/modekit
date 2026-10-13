import type { Plugin } from 'vue'

import { modeKitNeutralColors, modeKitPrimaryColors } from '../colors.js'
import { modeKitOptionsKey } from './context.js'
import type { ModeKitOptions } from './types.js'

function applyTheme(options: ModeKitOptions): void {
  if (typeof document === 'undefined' || !options.theme) return

  const { neutral, primary } = options.theme
  const root = document.documentElement

  if (primary && modeKitPrimaryColors.includes(primary)) root.dataset.mkPrimary = primary
  if (neutral && modeKitNeutralColors.includes(neutral)) root.dataset.mkNeutral = neutral
}

export function createModeKit(options: ModeKitOptions = {}): Plugin {
  return {
    install(app) {
      applyTheme(options)
      app.provide(modeKitOptionsKey, options)
    },
  }
}
