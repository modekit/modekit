<script lang="ts">
import { radioGroupOrientations, radioGroupSizes, radioGroupVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkRadioGroup',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'default',
      options: selectOptions(radioGroupVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(radioGroupSizes),
    },
    {
      prop: 'orientation',
      label: 'Orientation',
      defaultValue: 'vertical',
      options: selectOptions(radioGroupOrientations),
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

const plan = ref('team')
const plans = [
  { label: 'Starter', value: 'starter', description: 'For personal projects.' },
  { label: 'Team', value: 'team', description: 'For growing teams.' },
  { label: 'Enterprise', value: 'enterprise', description: 'For larger organizations.' },
]
${scriptEnd}

<template>
  <MkRadioGroup
    v-model="plan"
    :items="plans"
    label="Workspace plan"
    description="Choose the plan that fits your team."
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    orientation="${String(values.orientation)}"
    :disabled="${String(values.disabled)}"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkRadioGroup } from '@modekit/vue'
import type { RadioGroupOrientation, RadioGroupSize, RadioGroupVariant } from '@modekit/vue'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    orientation?: RadioGroupOrientation
    size?: RadioGroupSize
    variant?: RadioGroupVariant
  }>(),
  {
    disabled: false,
    orientation: 'vertical',
    size: 'md',
    variant: 'default',
  },
)

const plan = ref('team')
const plans = [
  { label: 'Starter', value: 'starter', description: 'For personal projects.' },
  { label: 'Team', value: 'team', description: 'For growing teams.' },
  { label: 'Enterprise', value: 'enterprise', description: 'For larger organizations.' },
]
const displayItems = computed(() =>
  props.variant === 'segmented' || props.variant === 'pills'
    ? plans.map(({ label, value }) => ({ label, value }))
    : plans,
)
</script>

<template>
  <MkRadioGroup
    v-model="plan"
    description="Choose the plan that fits your team."
    :disabled="props.disabled"
    :items="displayItems"
    label="Workspace plan"
    :orientation="props.orientation"
    :size="props.size"
    :variant="props.variant"
  />
</template>
