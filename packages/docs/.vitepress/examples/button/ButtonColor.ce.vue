<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Button',
  controls: [],
})
</script>

<script setup lang="ts">
import { MkButton } from '@modekit/vue'
import type { ButtonColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
  }>(),
  {
    color: 'primary',
  },
)
</script>

<template>
  <MkButton :color="props.color">Button</MkButton>
</template>
