<script lang="ts">
import { buttonGroupOrientations, buttonSizes, buttonVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkButtonGroup',
  content: '',
  controls: [
    {
      prop: 'orientation',
      label: 'Orientation',
      defaultValue: 'horizontal',
      options: selectOptions(buttonGroupOrientations),
    },
    {
      prop: 'size',
      label: 'Button size',
      defaultValue: 'md',
      options: selectOptions(buttonSizes),
    },
    {
      prop: 'variant',
      label: 'Button variant',
      defaultValue: 'outline',
      options: selectOptions(buttonVariants),
    },
  ],
  code: (values) => `<template>
  <MkButtonGroup orientation="${String(values.orientation)}" aria-label="Report period">
    <MkButton size="${String(values.size)}" variant="${String(values.variant)}">Day</MkButton>
    <MkButton size="${String(values.size)}" variant="${String(values.variant)}">Week</MkButton>
    <MkButton size="${String(values.size)}" variant="${String(values.variant)}">Month</MkButton>
  </MkButtonGroup>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkButtonGroup } from '@modekit/vue'
import type { ButtonGroupOrientation, ButtonSize, ButtonVariant } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    orientation?: ButtonGroupOrientation
    size?: ButtonSize
    variant?: ButtonVariant
  }>(),
  {
    orientation: 'horizontal',
    size: 'md',
    variant: 'outline',
  },
)
</script>

<template>
  <MkButtonGroup :orientation="props.orientation" aria-label="Report period">
    <MkButton :size="props.size" :variant="props.variant">Day</MkButton>
    <MkButton :size="props.size" :variant="props.variant">Week</MkButton>
    <MkButton :size="props.size" :variant="props.variant">Month</MkButton>
  </MkButtonGroup>
</template>
