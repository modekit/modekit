<script lang="ts">
import { gridAlignments, gridSpacePresets } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkGrid',
  content: '',
  controls: [
    {
      prop: 'columns',
      label: 'Columns',
      defaultValue: 3,
      options: [1, 2, 3, 4].map((value) => ({ label: String(value), value })),
    },
    {
      prop: 'gap',
      label: 'Gap',
      defaultValue: 'm',
      options: selectOptions(gridSpacePresets),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'stretch',
      options: selectOptions(gridAlignments),
    },
  ],
  code: (values) => `<template>
  <MkGrid :columns="${String(values.columns)}" gap="${String(values.gap)}" align="${String(values.align)}">
    <MkCard v-for="item in items" :key="item" variant="outline" size="sm">
      {{ item }}
    </MkCard>
  </MkGrid>
</template>`,
})
</script>

<script setup lang="ts">
import { MkCard, MkGrid } from '@modekit/vue'
import type { GridAlign, GridGap } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    align?: GridAlign
    columns?: number
    gap?: GridGap
  }>(),
  {
    align: 'stretch',
    columns: 3,
    gap: 'm',
  },
)

const items = ['Analytics', 'Customers', 'Revenue', 'Campaigns', 'Regions', 'Tasks']
</script>

<template>
  <MkGrid :align="props.align" :columns="props.columns" :gap="props.gap" style="width: 100%">
    <MkCard v-for="item in items" :key="item" variant="outline" size="sm">
      {{ item }}
    </MkCard>
  </MkGrid>
</template>
