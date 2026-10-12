<script lang="ts">
import { cardSizes, cardVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkCard',
  content: 'ModeKit keeps composition explicit.',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(cardVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(cardSizes),
    },
  ],
  code: (values) => `<MkCard variant="${String(values.variant)}" size="${String(values.size)}">
  <template #header>
    <strong>Weekly overview</strong>
  </template>
  ModeKit keeps composition explicit.
  <template #footer>
    <small>Updated just now</small>
  </template>
</MkCard>`,
})
</script>

<script setup lang="ts">
import { MkCard } from '@modekit/vue'
import type { CardSize, CardVariant } from '@modekit/vue'

withDefaults(
  defineProps<{
    size?: CardSize
    variant?: CardVariant
  }>(),
  {
    size: 'md',
    variant: 'default',
  },
)
</script>

<template>
  <MkCard :size="size" :variant="variant">
    <template #header>
      <strong>Weekly overview</strong>
    </template>
    ModeKit keeps composition explicit.
    <template #footer>
      <small>Updated just now</small>
    </template>
  </MkCard>
</template>
