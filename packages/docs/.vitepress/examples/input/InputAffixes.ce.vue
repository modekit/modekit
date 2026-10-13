<script lang="ts">
import { inputSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkInput',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(inputSizes),
    },
    {
      prop: 'loading',
      label: 'Loading',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
  ],
  code: (values) => `<script setup lang="ts">
import { CircleDollarSign, Command, DollarSign, Search } from '@lucide/vue'
${scriptEnd}

<template>
  <MkInput size="${String(values.size)}" placeholder="Search" :loading="${String(values.loading)}">
    <template #leading><Search /></template>
    <template #trailing><Command /></template>
  </MkInput>

  <MkInput size="${String(values.size)}" placeholder="Amount">
    <template #leading><DollarSign /></template>
    <template #trailing><CircleDollarSign /></template>
  </MkInput>
</template>`,
})
</script>

<script setup lang="ts">
import { CircleDollarSign, Command, DollarSign, Search } from '@lucide/vue'
import { MkInput } from '@modekit/vue'
import type { InputSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    size?: InputSize
  }>(),
  {
    loading: true,
    size: 'md',
  },
)
</script>

<template>
  <div style="display: grid; width: min(100%, 28rem); gap: 0.75rem">
    <MkInput :loading="props.loading" placeholder="Search" :size="props.size">
      <template #leading>
        <Search aria-hidden="true" :size="16" :stroke-width="1.75" />
      </template>
      <template #trailing>
        <Command aria-hidden="true" :size="16" :stroke-width="1.75" />
      </template>
    </MkInput>

    <MkInput placeholder="Amount" :size="props.size">
      <template #leading>
        <DollarSign aria-hidden="true" :size="16" :stroke-width="1.75" />
      </template>
      <template #trailing>
        <CircleDollarSign aria-hidden="true" :size="16" :stroke-width="1.75" />
      </template>
    </MkInput>
  </div>
</template>
