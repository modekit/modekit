import type { ButtonStyleConfig } from '../components/button/types.js'
import type { CardStyleConfig } from '../components/card/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'

export interface ModeKitUIConfig {
  button?: ButtonStyleConfig
  card?: CardStyleConfig
  spinner?: SpinnerStyleConfig
}

export interface ModeKitOptions {
  ui?: ModeKitUIConfig
}
