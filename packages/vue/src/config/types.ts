import type { CalloutStyleConfig } from '../components/callout/types.js'
import type { AvatarGroupStyleConfig, AvatarStyleConfig } from '../components/avatar/types.js'
import type { BadgeStyleConfig } from '../components/badge/types.js'
import type { ButtonGroupStyleConfig } from '../components/button-group/types.js'
import type { ButtonStyleConfig } from '../components/button/types.js'
import type { CardStyleConfig } from '../components/card/types.js'
import type { CheckboxStyleConfig } from '../components/checkbox/types.js'
import type { FlexStyleConfig } from '../components/flex/types.js'
import type { GridStyleConfig } from '../components/grid/types.js'
import type { InputStyleConfig } from '../components/input/types.js'
import type { LabelStyleConfig } from '../components/label/types.js'
import type { SpacingStyleConfig } from '../components/spacing/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'
import type { TabsStyleConfig } from '../components/tabs/types.js'
import type {
  CaptionStyleConfig,
  EllipsisTextStyleConfig,
  HeadlineStyleConfig,
  LinkStyleConfig,
  MarkStyleConfig,
  ParagraphStyleConfig,
  TextStyleConfig,
} from '../components/typography/types.js'
import type { ModeKitNeutralColor, ModeKitPrimaryColor } from '../colors.js'

export interface ModeKitUIConfig {
  callout?: CalloutStyleConfig
  avatar?: AvatarStyleConfig
  avatarGroup?: AvatarGroupStyleConfig
  badge?: BadgeStyleConfig
  button?: ButtonStyleConfig
  buttonGroup?: ButtonGroupStyleConfig
  card?: CardStyleConfig
  checkbox?: CheckboxStyleConfig
  flex?: FlexStyleConfig
  grid?: GridStyleConfig
  input?: InputStyleConfig
  label?: LabelStyleConfig
  spacing?: SpacingStyleConfig
  spinner?: SpinnerStyleConfig
  tabs?: TabsStyleConfig
  headline?: HeadlineStyleConfig
  text?: TextStyleConfig
  paragraph?: ParagraphStyleConfig
  caption?: CaptionStyleConfig
  ellipsisText?: EllipsisTextStyleConfig
  mark?: MarkStyleConfig
  link?: LinkStyleConfig
}

export interface ModeKitThemeConfig {
  primary?: ModeKitPrimaryColor
  neutral?: ModeKitNeutralColor
}

export interface ModeKitOptions {
  theme?: ModeKitThemeConfig
  ui?: ModeKitUIConfig
}
