<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSelect',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { CircleAlert, CircleCheck, CircleDashed, CircleDot } from '@lucide/vue'
import type { Component } from 'vue'
import { ref } from 'vue'

const status = ref('progress')
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'progress' },
  { label: 'Done', value: 'done' },
]
const icons: Record<string, Component> = {
  backlog: CircleDashed,
  todo: CircleDot,
  progress: CircleAlert,
  done: CircleCheck,
}
<\x2Fscript>

<template>
  <MkSelect v-model="status" :items="items">
    <template #leading="{ modelValue }">
      <component :is="icons[String(modelValue)]" aria-hidden="true" />
    </template>
    <template #item-leading="{ item }">
      <component :is="icons[String(item.value)]" aria-hidden="true" />
    </template>
    <template #item-trailing="{ selected }">
      <MkBadge v-if="selected" size="sm" variant="soft">Current</MkBadge>
    </template>
  </MkSelect>
</template>`,
})
</script>

<script setup lang="ts">
import { CircleAlert, CircleCheck, CircleDashed, CircleDot } from '@lucide/vue'
import { MkBadge, MkSelect } from '@modekit/vue'
import type { SelectItem } from '@modekit/vue'
import type { Component } from 'vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const status = ref('progress')
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'progress' },
  { label: 'Done', value: 'done' },
] satisfies readonly SelectItem[]
const icons: Record<string, Component> = {
  backlog: CircleDashed,
  todo: CircleDot,
  progress: CircleAlert,
  done: CircleCheck,
}
</script>

<template>
  <MkSelect
    v-model="status"
    aria-label="Project status"
    :items="items"
    :portal="portalTarget"
    style="width: min(100%, 20rem)"
  >
    <template #leading="{ modelValue }">
      <component :is="icons[String(modelValue)]" aria-hidden="true" />
    </template>
    <template #item-leading="{ item }">
      <component :is="icons[String(item.value)]" aria-hidden="true" />
    </template>
    <template #item-trailing="{ selected }">
      <MkBadge v-if="selected" size="sm" variant="soft">Current</MkBadge>
    </template>
  </MkSelect>
</template>
