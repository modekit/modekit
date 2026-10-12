<script lang="ts">
import { buttonColors } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButton',
  content: 'Saving',
  controls: [
    {
      prop: 'loading',
      label: 'Loading',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'primary',
      options: selectOptions(buttonColors),
    },
  ],
  code: (values) => `<MkButton color="${String(values.color)}" :loading="${String(values.loading)}">
  <template #loader>
    <span class="button-spinner" aria-hidden="true" />
  </template>
  Saving
</MkButton>`,
})
</script>

<script setup lang="ts">
import { MkButton } from '@modekit/vue'
import type { ButtonColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    loading?: boolean
  }>(),
  {
    color: 'primary',
    loading: true,
  },
)
</script>

<template>
  <MkButton :color="props.color" :loading="props.loading">
    <template #loader>
      <span class="button-spinner" aria-hidden="true" />
    </template>
    Saving
  </MkButton>
</template>

<style scoped>
.button-spinner {
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 700ms linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .button-spinner {
    animation: none;
  }
}
</style>
