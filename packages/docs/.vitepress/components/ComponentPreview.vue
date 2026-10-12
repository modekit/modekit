<script setup lang="ts">
import { ModeKitProvider, platforms } from '@modekit/vue'
import { useData } from 'vitepress'
import { computed, defineCustomElement, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ColorScheme, Platform } from '@modekit/vue'
import type { Component, ComponentObjectPropsOptions } from 'vue'

import { modeKitStyles } from './modekit-styles.js'

type StyledComponent = Component & {
  styles?: string[]
}

interface PreviewElement extends HTMLElement {
  colorScheme: ColorScheme
  platform: Platform
}

const props = defineProps<{
  name: string
}>()

const { isDark } = useData()

const componentModules = import.meta.glob<StyledComponent>('../examples/**/*.ce.vue', {
  eager: true,
  import: 'default',
})

const sourceModules = import.meta.glob<string>('../examples/**/*.ce.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
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
  min-height: 14rem;
  padding: 2rem;
  background: var(--mk-color-bg);
  color: var(--mk-color-text);
  font-family: var(--mk-font-family);
}

@media (max-width: 639px) {
  .mk-docs-preview-surface {
    min-height: 12rem;
    padding: 1.5rem 1rem;
  }
}
`

const examplePath = computed(() => `../examples/${props.name}.ce.vue`)
const example = computed(() => componentModules[examplePath.value])
const source = computed(() => sourceModules[examplePath.value])
const colorScheme = computed<ColorScheme>(() => (isDark.value ? 'dark' : 'light'))
const platform = ref<Platform>('web')
const isSourceVisible = ref(false)
const copyStatus = ref<'idle' | 'copied' | 'failed'>('idle')
const previewHost = ref<HTMLElement>()
let copyStatusTimeout: number | undefined
let previewElement: PreviewElement | undefined

function platformLabel(value: Platform): string {
  if (value === 'ios') {
    return 'iOS'
  }

  return value === 'web' ? 'Web' : 'Android'
}

function customElementName(name: string): string {
  return `mk-docs-example-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function syncPreviewProps(): void {
  if (!previewElement) {
    return
  }

  previewElement.platform = platform.value
  previewElement.colorScheme = colorScheme.value
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
      platform: {
        type: String,
        default: 'web',
      },
      colorScheme: {
        type: String,
        default: 'light',
      },
    } satisfies ComponentObjectPropsOptions

    const PreviewElementConstructor = defineCustomElement({
      name: 'ModeKitDocsPreview',
      props: previewProps,
      styles: [modeKitStyles, ...(component.styles ?? []), frameStyles],
      setup(elementProps) {
        return () =>
          h(
            ModeKitProvider,
            {
              class: 'mk-docs-preview-surface',
              platform: elementProps.platform as Platform,
              colorScheme: elementProps.colorScheme as ColorScheme,
            },
            () => h(component),
          )
      },
    })

    customElements.define(elementName, PreviewElementConstructor)
  }

  previewElement = document.createElement(elementName) as PreviewElement
  syncPreviewProps()
  host.replaceChildren(previewElement)
}

async function copySource(): Promise<void> {
  if (!source.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(source.value)
    copyStatus.value = 'copied'
  } catch {
    copyStatus.value = 'failed'
  }

  window.clearTimeout(copyStatusTimeout)
  copyStatusTimeout = window.setTimeout(() => {
    copyStatus.value = 'idle'
  }, 1600)
}

function copyLabel(): string {
  if (copyStatus.value === 'copied') {
    return 'Copied'
  }

  return copyStatus.value === 'failed' ? 'Copy failed' : 'Copy code'
}

onMounted(mountPreview)
watch([platform, colorScheme], syncPreviewProps)

onBeforeUnmount(() => {
  window.clearTimeout(copyStatusTimeout)
  previewElement?.remove()
})
</script>

<template>
  <section class="mk-docs-preview">
    <header v-if="source" class="mk-docs-preview__toolbar">
      <div class="mk-docs-preview__platforms" aria-label="Preview platform">
        <button
          v-for="option in platforms"
          :key="option"
          type="button"
          :class="{ 'is-active': platform === option }"
          :aria-pressed="platform === option"
          @click="platform = option"
        >
          {{ platformLabel(option) }}
        </button>
      </div>

      <div class="mk-docs-preview__actions">
        <button
          type="button"
          :aria-expanded="isSourceVisible"
          @click="isSourceVisible = !isSourceVisible"
        >
          {{ isSourceVisible ? 'Hide code' : 'View code' }}
        </button>
        <button type="button" @click="copySource">
          {{ copyLabel() }}
        </button>
      </div>
    </header>

    <div v-if="example" ref="previewHost" class="mk-docs-preview__canvas" />

    <p v-else class="mk-docs-preview__error">
      Example <code>{{ name }}</code> could not be found.
    </p>

    <div v-if="source && isSourceVisible" class="mk-docs-preview__source">
      <pre><code>{{ source }}</code></pre>
    </div>
  </section>
</template>
