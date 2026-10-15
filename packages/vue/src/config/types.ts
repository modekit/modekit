import type { CalloutStyleConfig } from '../components/callout/types.js'
import type { AvatarGroupStyleConfig, AvatarStyleConfig } from '../components/avatar/types.js'
import type { BadgeStyleConfig } from '../components/badge/types.js'
import type { ButtonGroupStyleConfig } from '../components/button-group/types.js'
import type { ButtonStyleConfig } from '../components/button/types.js'
import type { CardEdgeStyleConfig, CardStyleConfig } from '../components/card/types.js'
import type { CheckboxStyleConfig } from '../components/checkbox/types.js'
import type { DialogStyleConfig } from '../components/dialog/types.js'
import type { DropdownStyleConfig } from '../components/dropdown/types.js'
import type { FlexStyleConfig } from '../components/flex/types.js'
import type { GridStyleConfig } from '../components/grid/types.js'
import type { HoverCardStyleConfig } from '../components/hover-card/types.js'
import type { InputStyleConfig } from '../components/input/types.js'
import type { LabelStyleConfig } from '../components/label/types.js'
import type { PopoverStyleConfig } from '../components/popover/types.js'
import type { SeparatorStyleConfig } from '../components/separator/types.js'
import type { SpacingStyleConfig } from '../components/spacing/types.js'
import type { SpinnerStyleConfig } from '../components/spinner/types.js'
import type { TabsStyleConfig } from '../components/tabs/types.js'
import type { TooltipStyleConfig } from '../components/tooltip/types.js'
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
  cardEdge?: CardEdgeStyleConfig
  checkbox?: CheckboxStyleConfig
  dialog?: DialogStyleConfig
  dropdown?: DropdownStyleConfig
  flex?: FlexStyleConfig
  grid?: GridStyleConfig
  hoverCard?: HoverCardStyleConfig
  input?: InputStyleConfig
  label?: LabelStyleConfig
  popover?: PopoverStyleConfig
  separator?: SeparatorStyleConfig
  spacing?: SpacingStyleConfig
  spinner?: SpinnerStyleConfig
  tabs?: TabsStyleConfig
  tooltip?: TooltipStyleConfig
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
