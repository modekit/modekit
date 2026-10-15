<script setup lang="ts">
import { useData } from 'vitepress'
import {
  computed,
  defineCustomElement,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import type { Component, ComponentObjectPropsOptions, PropType } from 'vue'

import { highlightVueTemplate } from './highlight.js'
import type { HighlightedCode } from './highlight.js'
import { modeKitStyles } from './modekit-styles.js'
import { previewPortalTargetKey } from './preview-portal.js'
import PreviewControl from './PreviewControl.vue'
import { createPreviewCode } from './preview.js'
import type {
  PreviewControl as PreviewControlDefinition,
  PreviewControlValue,
  PreviewDefinition,
} from './preview.js'

type StyledComponent = Component & {
  styles?: string[]
}

interface ExampleModule {
  default: StyledComponent
  preview: PreviewDefinition
}

interface PreviewElement extends HTMLElement {
  dark: boolean
  portalTarget?: HTMLElement
  values: Record<string, PreviewControlValue>
}

interface PreviewPortal {
  host: HTMLElement
  target: HTMLElement
}

const props = defineProps<{
  name: string
}>()

const { isDark } = useData()

const exampleModules = import.meta.glob<ExampleModule>('../examples/**/*.ce.vue', {
  eager: true,
})

const frameStyles = `
:host {
  display: block;
}

.mk-docs-preview-surface {
  all: initial;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  padding: 2rem;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

@media (max-width: 639px) {
  .mk-docs-preview-surface {
    min-height: 8rem;
    padding: 1.5rem 1rem;
  }
}
`

const portalFrameStyles = `
:host,
.mk-docs-preview-portal {
  display: contents;
}

.mk-docs-preview-portal {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
`

const examplePath = computed(() => `../examples/${props.name}.ce.vue`)
const exampleModule = computed(() => exampleModules[examplePath.value])
const example = computed(() => exampleModule.value?.default)
const definition = computed(() => exampleModule.value?.preview)
const previewHost = ref<HTMLElement>()
const controlValues = ref<Record<string, PreviewControlValue>>({})
const highlightedSource = ref<HighlightedCode>([])
let highlightRevision = 0
let previewElement: PreviewElement | undefined
let previewPortal: PreviewPortal | undefined

const source = computed(() => {
  const currentDefinition = definition.value

  if (!currentDefinition) {
    return ''
  }

  return (
    currentDefinition.code?.(controlValues.value) ??
    createPreviewCode(currentDefinition, controlValues.value)
  )
})

async function updateHighlightedSource(value: string): Promise<void> {
  const revision = ++highlightRevision
  highlightedSource.value = []

  if (!value || typeof window === 'undefined') {
    return
  }

  const highlighted = await highlightVueTemplate(value)

  if (revision === highlightRevision) {
    highlightedSource.value = highlighted
  }
}

function customElementName(name: string): string {
  return `mk-docs-example-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function resetControlValues(): void {
  controlValues.value = Object.fromEntries(
    (definition.value?.controls ?? []).map((control) => [control.prop, control.defaultValue]),
  )
}

function syncPreview(): void {
  if (previewElement) {
    previewElement.dark = isDark.value
    previewElement.values = { ...controlValues.value }
  }

  previewPortal?.target.classList.toggle('dark', isDark.value)
}

function createPreviewPortal(): PreviewPortal {
  const host = document.createElement('div')
  const shadowRoot = host.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  const target = document.createElement('div')

  host.className = 'mk-docs-preview-portal-host'
  style.textContent = `${modeKitStyles}\n${portalFrameStyles}`
  target.className = 'mk-docs-preview-portal'
  shadowRoot.append(style, target)
  document.body.append(host)

  return { host, target }
}

function removePreviewPortal(): void {
  previewPortal?.host.remove()
  previewPortal = undefined
}

function mountPreview(): void {
  const component = example.value
  const currentDefinition = definition.value
  const host = previewHost.value

  if (!component || !currentDefinition || !host) {
    return
  }

  const elementName = customElementName(props.name)

  if (!customElements.get(elementName)) {
    const previewProps = {
      dark: {
        type: Boolean,
        default: false,
      },
      portalTarget: {
        type: Object as PropType<HTMLElement>,
        default: undefined,
      },
      values: {
        type: Object as PropType<Record<string, PreviewControlValue>>,
        default: () => ({}),
      },
    } satisfies ComponentObjectPropsOptions

    const PreviewElementConstructor = defineCustomElement({
      name: 'ModeKitDocsPreview',
      props: previewProps,
      styles: [modeKitStyles, ...(component.styles ?? []), frameStyles],
      setup(elementProps) {
        if (elementProps.portalTarget) {
          provide(previewPortalTargetKey, elementProps.portalTarget)
        }

        return () =>
          h(
            'div',
            {
              class: ['mk-docs-preview-surface', { dark: elementProps.dark }],
            },
            h(component, elementProps.values),
          )
      },
    })

    customElements.define(elementName, PreviewElementConstructor)
  }

  removePreviewPortal()
  previewPortal = currentDefinition.teleport ? createPreviewPortal() : undefined
  previewElement = document.createElement(elementName) as PreviewElement
  if (previewPortal) previewElement.portalTarget = previewPortal.target
  syncPreview()
  host.replaceChildren(previewElement)
}

function controlId(control: PreviewControlDefinition): string {
  return `${customElementName(props.name)}-${control.prop}`
}

function updateControlValue(control: PreviewControlDefinition, value: PreviewControlValue): void {
  controlValues.value[control.prop] = value
}

resetControlValues()
onMounted(mountPreview)
watch(isDark, syncPreview)
watch(controlValues, syncPreview, { deep: true })
watch(source, updateHighlightedSource, { immediate: true })

onBeforeUnmount(() => {
  previewElement?.remove()
  removePreviewPortal()
})
</script>

<template>
  <section class="mk-docs-preview">
    <header v-if="definition?.controls.length" class="mk-docs-preview__toolbar">
      <div class="mk-docs-preview__controls">
        <PreviewControl
          v-for="control in definition.controls"
          :id="controlId(control)"
          :key="control.prop"
          :control="control"
          :model-value="controlValues[control.prop] ?? control.defaultValue"
          @update:model-value="updateControlValue(control, $event)"
        />
      </div>
    </header>

    <div v-if="example && definition" ref="previewHost" class="mk-docs-preview__canvas" />

    <p v-else class="mk-docs-preview__error">
      Example <code>{{ name }}</code> could not be found.
    </p>

    <div v-if="source" class="mk-docs-preview__source">
      <pre v-if="highlightedSource.length" class="mk-docs-preview__highlighted"><code><span
        v-for="(line, lineIndex) in highlightedSource"
        :key="lineIndex"
        class="mk-docs-preview__line"
      ><span
        v-for="(token, tokenIndex) in line"
        :key="tokenIndex"
        class="mk-docs-preview__token"
        :style="token.style"
      >{{ token.content }}</span></span></code></pre>
      <pre v-else><code>{{ source }}</code></pre>
    </div>
  </section>
</template>
