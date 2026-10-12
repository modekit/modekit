import type { Plugin } from 'vue'

import { modeKitOptionsKey } from './context.js'
import type { ModeKitOptions } from './types.js'

export function createModeKit(options: ModeKitOptions = {}): Plugin {
  return {
    install(app) {
      app.provide(modeKitOptionsKey, options)
    },
  }
}
