import type { AvatarStyleConfig } from '../components/avatar/types.js'
import type { BadgeStyleConfig } from '../components/badge/types.js'
import type { ButtonStyleConfig } from '../components/button/types.js'
import type { CardStyleConfig } from '../components/card/types.js'
import type { CheckboxStyleConfig } from '../components/checkbox/types.js'
import type { InputStyleConfig } from '../components/input/types.js'
import type { LabelStyleConfig } from '../components/label/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'
import type { TabsStyleConfig } from '../components/tabs/types.js'

export interface ModeKitUIConfig {
  avatar?: AvatarStyleConfig
  badge?: BadgeStyleConfig
  button?: ButtonStyleConfig
  card?: CardStyleConfig
  checkbox?: CheckboxStyleConfig
  input?: InputStyleConfig
  label?: LabelStyleConfig
  spinner?: SpinnerStyleConfig
  tabs?: TabsStyleConfig
}

export interface ModeKitOptions {
  ui?: ModeKitUIConfig
}
