<script lang="ts">
import { checkboxSizes, checkboxVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkCheckbox',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(checkboxVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(checkboxSizes),
    },
    {
      prop: 'disabled',
      label: 'Disabled',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
  ],
  code: (values) => `<script setup lang="ts">
import { ref } from 'vue'

const accepted = ref(false)
${scriptEnd}

<template>
  <MkCheckbox
    v-model="accepted"
    label="Accept terms and conditions"
    description="You can review the terms before continuing."
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    :disabled="${String(values.disabled)}"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkCheckbox } from '@modekit/vue'
import type { CheckboxSize, CheckboxVariant } from '@modekit/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    size?: CheckboxSize
    variant?: CheckboxVariant
  }>(),
  {
    disabled: false,
    size: 'md',
    variant: 'default',
  },
)

const accepted = ref(false)
</script>

<template>
  <MkCheckbox
    v-model="accepted"
    description="You can review the terms before continuing."
    :disabled="props.disabled"
    label="Accept terms and conditions"
    :size="props.size"
    :variant="props.variant"
  />
</template>
