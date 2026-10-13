<script lang="ts">
import { badgeColors, badgeSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkBadge',
  content: 'Status',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(badgeSizes),
    },
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'primary',
      options: selectOptions(badgeColors),
    },
  ],
})
</script>

<script setup lang="ts">
import { MkBadge } from '@modekit/vue'
import type { BadgeColor, BadgeSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
    size?: BadgeSize
  }>(),
  {
    color: 'primary',
    size: 'md',
  },
)
</script>

<template>
  <MkBadge :color="props.color" :size="props.size">Status</MkBadge>
</template>
