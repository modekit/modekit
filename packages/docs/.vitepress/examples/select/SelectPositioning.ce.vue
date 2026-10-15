<script lang="ts">
import { selectAlignments, selectPositions, selectSides } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSelect',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'position',
      label: 'Position',
      defaultValue: 'popper',
      options: selectOptions(selectPositions),
    },
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'bottom',
      options: selectOptions(selectSides),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'start',
      options: selectOptions(selectAlignments),
    },
    {
      prop: 'arrow',
      label: 'Arrow',
      defaultValue: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
  ],
  code: (values) => `<MkSelect
  default-value="todo"
  :items="items"
  position="${String(values.position)}"
  side="${String(values.side)}"
  align="${String(values.align)}"
  :arrow="${String(values.arrow)}"
/>`,
})
</script>

<script setup lang="ts">
import { MkSelect } from '@modekit/vue'
import type { SelectAlign, SelectItem, SelectPosition, SelectSide } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const props = withDefaults(
  defineProps<{
    align?: SelectAlign
    arrow?: boolean
    position?: SelectPosition
    side?: SelectSide
  }>(),
  {
    align: 'start',
    arrow: true,
    position: 'popper',
    side: 'bottom',
  },
)

const portalTarget = usePreviewPortalTarget()
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
] satisfies readonly SelectItem[]
</script>

<template>
  <MkSelect
    :align="props.align"
    :arrow="props.arrow"
    aria-label="Project status"
    default-value="todo"
    :items="items"
    :portal="portalTarget"
    :position="props.position"
    :side="props.side"
    style="width: min(100%, 18rem)"
  />
</template>
