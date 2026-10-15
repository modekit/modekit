<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkDialog
    size="lg"
    title="Release notes"
    description="The header and footer remain visible while long content scrolls."
  >
    <MkButton variant="outline">Read release notes</MkButton>

    <template #content>
      <MkGrid gap="l">
        <section v-for="section in sections" :key="section.title">
          <MkHeadline as="h3" size="xs">{{ section.title }}</MkHeadline>
          <MkParagraph size="sm">{{ section.body }}</MkParagraph>
        </section>
      </MkGrid>
    </template>

    <template #footer="{ close }">
      <MkButton @click="close">Got it</MkButton>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDialog, MkGrid, MkHeadline, MkParagraph } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const sections = Array.from({ length: 8 }, (_, index) => ({
  title: `Improvement ${String(index + 1)}`,
  body: 'ModeKit components now compose more predictably across responsive layouts, keyboard workflows, and application themes.',
}))
</script>

<template>
  <MkDialog
    description="The header and footer remain visible while long content scrolls."
    :portal="portalTarget"
    size="lg"
    title="Release notes"
  >
    <MkButton variant="outline">Read release notes</MkButton>

    <template #content>
      <MkGrid gap="l">
        <section v-for="section in sections" :key="section.title">
          <MkHeadline as="h3" size="xs">{{ section.title }}</MkHeadline>
          <MkParagraph size="sm">{{ section.body }}</MkParagraph>
        </section>
      </MkGrid>
    </template>

    <template #footer="{ close }">
      <MkButton @click="close">Got it</MkButton>
    </template>
  </MkDialog>
</template>
