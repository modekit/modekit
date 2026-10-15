<script lang="ts">
import { selectSizes, selectVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkSelect',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'outline',
      options: selectOptions(selectVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(selectSizes),
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
    {
      prop: 'invalid',
      label: 'Invalid',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
    {
      prop: 'loading',
      label: 'Loading',
      defaultValue: false,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
  ],
  code: (values) => `<script setup lang="ts">
import type { SelectItem } from '@modekit/vue'
import { ref } from 'vue'

const status = ref('')
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
] satisfies readonly SelectItem[]
${scriptEnd}

<template>
  <MkSelect
    v-model="status"
    :items="items"
    placeholder="Select status"
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    :disabled="${String(values.disabled)}"
    :invalid="${String(values.invalid)}"
    :loading="${String(values.loading)}"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSelect } from '@modekit/vue'
import type { SelectItem, SelectSize, SelectVariant } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    invalid?: boolean
    loading?: boolean
    size?: SelectSize
    variant?: SelectVariant
  }>(),
  {
    disabled: false,
    invalid: false,
    loading: false,
    size: 'md',
    variant: 'outline',
  },
)

const portalTarget = usePreviewPortalTarget()
const status = ref('')
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
] satisfies readonly SelectItem[]
</script>

<template>
  <MkSelect
    v-model="status"
    aria-label="Project status"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :items="items"
    :loading="props.loading"
    placeholder="Select status"
    :portal="portalTarget"
    :size="props.size"
    :variant="props.variant"
    style="width: min(100%, 18rem)"
  />
</template>
