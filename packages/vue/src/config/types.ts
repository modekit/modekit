import type { CalloutStyleConfig } from '../components/callout/types.js'
import type { AvatarGroupStyleConfig, AvatarStyleConfig } from '../components/avatar/types.js'
import type { BadgeStyleConfig } from '../components/badge/types.js'
import type { ButtonGroupStyleConfig } from '../components/button-group/types.js'
import type { ButtonStyleConfig } from '../components/button/types.js'
import type { CardStyleConfig } from '../components/card/types.js'
import type { CheckboxStyleConfig } from '../components/checkbox/types.js'
import type { InputStyleConfig } from '../components/input/types.js'
import type { LabelStyleConfig } from '../components/label/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'
import type { TabsStyleConfig } from '../components/tabs/types.js'

export interface ModeKitUIConfig {
  callout?: CalloutStyleConfig
  avatar?: AvatarStyleConfig
  avatarGroup?: AvatarGroupStyleConfig
  badge?: BadgeStyleConfig
  button?: ButtonStyleConfig
  buttonGroup?: ButtonGroupStyleConfig
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
