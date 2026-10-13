<script lang="ts">
import { badgeSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkBadge',
  content: 'Rounded',
  controls: [
    {
      prop: 'rounded',
      label: 'Rounded',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(badgeSizes),
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
    rounded?: boolean
    size?: BadgeSize
  }>(),
  {
    color: 'primary',
    rounded: true,
    size: 'md',
  },
)
</script>

<template>
  <MkBadge :color="props.color" :rounded="props.rounded" :size="props.size">Rounded</MkBadge>
</template>
