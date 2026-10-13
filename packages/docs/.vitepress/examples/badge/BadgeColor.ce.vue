<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkBadge',
  content: 'Status',
  controls: [],
})
</script>

<script setup lang="ts">
import { MkBadge } from '@modekit/vue'
import type { BadgeColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
  }>(),
  {
    color: 'primary',
  },
)
</script>

<template>
  <MkBadge :color="props.color">Status</MkBadge>
</template>
