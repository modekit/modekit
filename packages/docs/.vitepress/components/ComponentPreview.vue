<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, defineCustomElement, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component, ComponentObjectPropsOptions, PropType } from 'vue'

import { highlightVueTemplate } from './highlight.js'
import type { HighlightedCode } from './highlight.js'
import { modeKitStyles } from './modekit-styles.js'
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
  values: Record<string, PreviewControlValue>
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
  background: #ffffff;
  color: #0f172a;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.mk-docs-preview-surface.dark {
  background: #020617;
  color: #f8fafc;
}

@media (max-width: 639px) {
  .mk-docs-preview-surface {
    min-height: 8rem;
    padding: 1.5rem 1rem;
  }
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
  if (!previewElement) {
    return
  }

  previewElement.dark = isDark.value
  previewElement.values = { ...controlValues.value }
}

function mountPreview(): void {
  const component = example.value
  const host = previewHost.value

  if (!component || !host) {
    return
  }

  const elementName = customElementName(props.name)

  if (!customElements.get(elementName)) {
    const previewProps = {
      dark: {
        type: Boolean,
        default: false,
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

  previewElement = document.createElement(elementName) as PreviewElement
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
