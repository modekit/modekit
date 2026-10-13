import type { ButtonStyleConfig } from '../components/button/types.js'
import type { CardStyleConfig } from '../components/card/types.js'
import type { CheckboxStyleConfig } from '../components/checkbox/types.js'
import type { LabelStyleConfig } from '../components/label/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'
import type { TabsStyleConfig } from '../components/tabs/types.js'

export interface ModeKitUIConfig {
  button?: ButtonStyleConfig
  card?: CardStyleConfig
  checkbox?: CheckboxStyleConfig
  label?: LabelStyleConfig
  spinner?: SpinnerStyleConfig
  tabs?: TabsStyleConfig
}

export interface ModeKitOptions {
  ui?: ModeKitUIConfig
}
