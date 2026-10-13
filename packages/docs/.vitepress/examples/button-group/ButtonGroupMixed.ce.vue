<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkButtonGroup',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { ChevronDown, Download } from '@lucide/vue'
import { MkButton, MkButtonGroup } from '@modekit/vue'
${scriptEnd}

<template>
  <MkButtonGroup aria-label="Export options">
    <MkButton variant="outline">
      <template #leading><Download aria-hidden="true" /></template>
      Export
    </MkButton>
    <MkButton variant="outline" square aria-label="More export options">
      <ChevronDown aria-hidden="true" />
    </MkButton>
  </MkButtonGroup>
</template>`,
})
</script>

<script setup lang="ts">
import { ChevronDown, Download } from '@lucide/vue'
import { MkButton, MkButtonGroup } from '@modekit/vue'
</script>

<template>
  <MkButtonGroup aria-label="Export options">
    <MkButton variant="outline">
      <template #leading><Download aria-hidden="true" /></template>
      Export
    </MkButton>
    <MkButton variant="outline" square aria-label="More export options">
      <ChevronDown aria-hidden="true" />
    </MkButton>
  </MkButtonGroup>
</template>
