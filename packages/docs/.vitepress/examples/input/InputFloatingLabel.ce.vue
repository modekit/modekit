<script lang="ts">
import { inputFloatingPositions, inputSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkInput',
  content: '',
  controls: [
    {
      prop: 'floating',
      label: 'Floating',
      defaultValue: 'border',
      options: selectOptions(inputFloatingPositions),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(inputSizes),
    },
    {
      prop: 'invalid',
      label: 'Invalid',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
  ],
  code: (values) => `<script setup lang="ts">
import { AtSign } from '@lucide/vue'
import { ref } from 'vue'

const email = ref('Testing Value')
${scriptEnd}

<template>
  <MkInput
    v-model="email"
    floating="${String(values.floating)}"
    label="Email address"
    size="${String(values.size)}"
    :invalid="${String(values.invalid)}"
    type="email"
  />

  <MkInput
    default-value="modekit"
    floating="${String(values.floating)}"
    label="Username"
    size="${String(values.size)}"
  >
    <template #leading><AtSign /></template>
  </MkInput>
</template>`,
})
</script>

<script setup lang="ts">
import { AtSign } from '@lucide/vue'
import { MkInput } from '@modekit/vue'
import type { InputFloating, InputSize } from '@modekit/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    floating?: InputFloating
    invalid?: boolean
    size?: InputSize
  }>(),
  {
    floating: 'border',
    invalid: false,
    size: 'md',
  },
)

const email = ref('Testing Value')
</script>

<template>
  <div style="display: grid; width: min(100%, 28rem); gap: 0.75rem">
    <MkInput
      v-model="email"
      :floating="props.floating"
      :invalid="props.invalid"
      label="Email address"
      :size="props.size"
      type="email"
    />

    <MkInput default-value="modekit" :floating="props.floating" label="Username" :size="props.size">
      <template #leading>
        <AtSign aria-hidden="true" :size="16" :stroke-width="1.75" />
      </template>
    </MkInput>
  </div>
</template>
