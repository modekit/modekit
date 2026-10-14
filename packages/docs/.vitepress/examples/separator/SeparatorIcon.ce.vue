<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
import { MkSeparator } from '@modekit/vue'
${scriptEnd}

<template>
  <MkSeparator label="Highlights" primary>
    <template #icon>
      <Sparkles aria-hidden="true" />
    </template>
  </MkSeparator>
</template>`,
})
</script>

<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
import { MkSeparator } from '@modekit/vue'
</script>

<template>
  <MkSeparator class="separator-preview" label="Highlights" primary>
    <template #icon>
      <Sparkles aria-hidden="true" />
    </template>
  </MkSeparator>
</template>

<style>
.separator-preview {
  width: min(100%, 32rem);
}
</style>
