<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSelect',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import type { SelectItem } from '@modekit/vue'

const items = [
  {
    type: 'group',
    label: 'Active work',
    items: [
      { label: 'Backlog', value: 'backlog', description: 'Not started yet' },
      { label: 'In progress', value: 'in-progress', description: 'Work is underway' },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Closed',
    items: [
      { label: 'Done', value: 'done' },
      { label: 'Archived', value: 'archived', disabled: true },
    ],
  },
] satisfies readonly SelectItem[]
<\x2Fscript>

<template>
  <MkSelect
    default-value="in-progress"
    :items="items"
    placeholder="Select status"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSelect } from '@modekit/vue'
import type { SelectItem } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const items = [
  {
    type: 'group',
    label: 'Active work',
    items: [
      { label: 'Backlog', value: 'backlog', description: 'Not started yet' },
      { label: 'In progress', value: 'in-progress', description: 'Work is underway' },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Closed',
    items: [
      { label: 'Done', value: 'done' },
      { label: 'Archived', value: 'archived', disabled: true },
    ],
  },
] satisfies readonly SelectItem[]
</script>

<template>
  <MkSelect
    aria-label="Project status"
    default-value="in-progress"
    :items="items"
    placeholder="Select status"
    :portal="portalTarget"
    style="width: min(100%, 20rem)"
  />
</template>
