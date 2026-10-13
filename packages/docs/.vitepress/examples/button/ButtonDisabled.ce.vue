<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Button',
  controls: [
    {
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
  ],
})
</script>

<script setup lang="ts">
import { MkButton } from '@modekit/vue'
import type { ButtonColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    disabled?: boolean
  }>(),
  {
    color: 'primary',
    disabled: true,
  },
)
</script>

<template>
  <MkButton :color="props.color" :disabled="props.disabled">Button</MkButton>
</template>
