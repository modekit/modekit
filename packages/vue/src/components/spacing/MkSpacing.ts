import { h } from 'vue'
import type {
  ComponentObjectPropsOptions,
  FunctionalComponent,
  HTMLAttributes,
  PropType,
} from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getSpacingClasses } from './styles/index.js'
import { spacingOrientations, spacingSizes } from './types.js'
import type {
  SpacingCSSVariable,
  SpacingOptions,
  SpacingOrientation,
  SpacingPreset,
  SpacingProps,
  SpacingSize,
} from './types.js'

const spacingValues = {
  '2xs': '0.125rem',
  xs: '0.25rem',
  s: '0.5rem',
  m: '0.75rem',
  l: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '2.5rem',
  '4xl': '3rem',
} satisfies Record<(typeof spacingSizes)[number], string>

function isCSSVariable(value: string): value is SpacingCSSVariable {
  return (
    (value.startsWith('--') && value.length > 2) ||
    (value.startsWith('var(--') && value.endsWith(')') && value.length > 7)
  )
}

function isSpacingSize(value: unknown): value is SpacingSize {
  return (
    (typeof value === 'number' && Number.isFinite(value) && value >= 0) ||
    (typeof value === 'string' &&
      (value === 'full' ||
        spacingSizes.includes(value as (typeof spacingSizes)[number]) ||
        isCSSVariable(value)))
  )
}

function isSpacingOrientation(value: unknown): value is SpacingOrientation {
  return spacingOrientations.includes(value as SpacingOrientation)
}

function resolveSpacingSize(value: SpacingSize): string {
  if (typeof value === 'number') {
    return `${String(value)}px`
  }

  if (value.startsWith('--')) {
    return `var(${value})`
  }

  if (value.startsWith('var(--')) {
    return value
  }

  if (value === 'full') {
    return '100%'
  }

  return spacingValues[value as SpacingPreset]
}

const runtimeProps = {
  grow: {
    type: Boolean,
    default: false,
  },
  orientation: {
    type: String as PropType<SpacingOrientation>,
    validator: isSpacingOrientation,
  },
  size: {
    type: [String, Number] as PropType<SpacingSize>,
    validator: isSpacingSize,
  },
  ui: {
    type: Object as PropType<SpacingOptions['ui']>,
    default: undefined,
  },
} satisfies ComponentObjectPropsOptions<SpacingOptions>

type SpacingRuntimeProps = SpacingOptions & Omit<HTMLAttributes, 'class' | 'style'>

const MkSpacingComponent: FunctionalComponent<SpacingRuntimeProps> = (props, { attrs }) => {
  const options = useModeKitOptions()
  const orientation = props.orientation ?? 'vertical'
  const size = props.size ?? 'm'
  const attributes: HTMLAttributes = attrs
  const { class: className, style: attributeStyle, ...nativeAttributes } = attributes

  return h('div', {
    ...nativeAttributes,
    'aria-hidden': 'true',
    class: getSpacingClasses({
      config: options.ui?.spacing,
      ui: props.ui,
      className,
    }),
    'data-mk-grow': props.grow ? 'true' : undefined,
    'data-mk-orientation': props.grow ? undefined : orientation,
    'data-mk-size': props.grow ? undefined : size,
    style: [
      props.grow
        ? { flex: '1 1 0%', minBlockSize: '0', minInlineSize: '0' }
        : {
            [orientation === 'horizontal' ? 'inlineSize' : 'blockSize']: resolveSpacingSize(size),
          },
      attributeStyle,
    ],
  })
}

MkSpacingComponent.props = runtimeProps
MkSpacingComponent.displayName = 'MkSpacing'

export const MkSpacing = MkSpacingComponent as FunctionalComponent<SpacingProps>
