<script setup lang="ts">
import { useData } from 'vitepress'
import { defineCustomElement, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component, ComponentObjectPropsOptions, PropType } from 'vue'

import PreviewContent from './ComponentsOverviewPreview.ce.vue'
import { modeKitStyles } from './modekit-styles.js'

type StyledComponent = Component & {
  styles?: string[]
}

interface PreviewElement extends HTMLElement {
  dark: boolean
  kind: string
}

const props = defineProps<{
  kind: string
}>()

const { isDark } = useData()
const previewHost = ref<HTMLElement>()
let previewElement: PreviewElement | undefined

const elementName = 'mk-docs-components-overview-preview'
const previewContent = PreviewContent as StyledComponent
const frameStyles = `
:host {
  display: block;
  width: 100%;
  min-width: 0;
}

.mk-docs-overview-preview-surface {
  all: initial;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
  color: var(--mk-neutral-950);
  font-family: var(--vp-font-family-base, Inter, ui-sans-serif, system-ui, sans-serif);
}

.mk-docs-overview-preview-surface.dark {
  color: var(--mk-neutral-50);
}
`

function syncPreview(): void {
  if (!previewElement) return

  previewElement.dark = isDark.value
  previewElement.kind = props.kind
}

function mountPreview(): void {
  const host = previewHost.value

  if (!host) return

  if (!customElements.get(elementName)) {
    const previewProps = {
      dark: {
        type: Boolean,
        default: false,
      },
      kind: {
        type: String as PropType<string>,
        required: true,
      },
    } satisfies ComponentObjectPropsOptions

    const PreviewElementConstructor = defineCustomElement({
      name: 'ModeKitDocsComponentsOverviewPreview',
      props: previewProps,
      styles: [modeKitStyles, ...(previewContent.styles ?? []), frameStyles],
      setup(elementProps) {
        return () =>
          h(
            'div',
            {
              class: ['mk-docs-overview-preview-surface', { dark: elementProps.dark }],
            },
            h(previewContent, { kind: elementProps.kind }),
          )
      },
    })

    customElements.define(elementName, PreviewElementConstructor)
  }

  previewElement = document.createElement(elementName) as PreviewElement
  syncPreview()
  host.replaceChildren(previewElement)
}

onMounted(mountPreview)
watch(isDark, syncPreview)
watch(() => props.kind, syncPreview)

onBeforeUnmount(() => {
  previewElement?.remove()
})
</script>

<template>
  <div ref="previewHost" class="components-overview-preview" />
</template>

<style scoped>
.components-overview-preview {
  width: 100%;
  min-width: 0;
}
</style>
