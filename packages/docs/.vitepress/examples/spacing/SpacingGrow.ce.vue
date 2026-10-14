<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSpacing',
  content: '',
  controls: [],
  code: () => `<template>
  <div style="display: flex; align-items: center">
    <MkCard variant="outline" size="sm">Start</MkCard>
    <MkSpacing grow />
    <MkCard variant="outline" size="sm">End</MkCard>
  </div>
</template>`,
})
</script>

<script setup lang="ts">
import { MkCard, MkSpacing } from '@modekit/vue'
</script>

<template>
  <div class="spacing-grow-preview">
    <MkCard variant="outline" size="sm">Start</MkCard>
    <MkSpacing grow />
    <MkCard variant="outline" size="sm">End</MkCard>
  </div>
</template>

<style>
.spacing-grow-preview {
  display: flex;
  align-items: center;
  width: min(100%, 28rem);
}

.spacing-grow-preview > .mk-card {
  flex: 0 0 auto;
}
</style>
