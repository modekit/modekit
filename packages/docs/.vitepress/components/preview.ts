export type PreviewControlValue = boolean | number | string

export interface PreviewControlOption<T extends PreviewControlValue = PreviewControlValue> {
  label: string
  value: T
}

export interface PreviewControl<T extends PreviewControlValue = PreviewControlValue> {
  prop: string
  label: string
  defaultValue: T
  options: readonly PreviewControlOption<T>[]
}

export interface PreviewDefinition {
  componentName: string
  content: string
  controls: readonly PreviewControl[]
  teleport?: boolean
  code?: (values: Readonly<Record<string, PreviewControlValue>>) => string
}

export function definePreview(definition: PreviewDefinition): PreviewDefinition {
  return definition
}

export function selectOptions<T extends string>(values: readonly T[]): PreviewControlOption<T>[] {
  return values.map((value) => ({
    label: value,
    value,
  }))
}

function attributeFor(prop: string, value: PreviewControlValue): string {
  if (typeof value === 'boolean' || typeof value === 'number') {
    return `:${prop}="${String(value)}"`
  }

  return `${prop}="${value}"`
}

export function createPreviewCode(
  definition: PreviewDefinition,
  values: Readonly<Record<string, PreviewControlValue>>,
): string {
  const attributes = definition.controls.map((control) =>
    attributeFor(control.prop, values[control.prop] ?? control.defaultValue),
  )

  if (attributes.length <= 2) {
    const suffix = attributes.length > 0 ? ` ${attributes.join(' ')}` : ''
    return `<${definition.componentName}${suffix}>${definition.content}</${definition.componentName}>`
  }

  return [
    `<${definition.componentName}`,
    ...attributes.map((attribute) => `  ${attribute}`),
    '>',
    `  ${definition.content}`,
    `</${definition.componentName}>`,
  ].join('\n')
}
