import type { ButtonStyleConfig } from '../components/button/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'

export interface ModeKitUIConfig {
  button?: ButtonStyleConfig
  spinner?: SpinnerStyleConfig
}

export interface ModeKitOptions {
  ui?: ModeKitUIConfig
}
