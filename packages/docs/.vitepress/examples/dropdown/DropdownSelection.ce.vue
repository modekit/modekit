<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDropdown',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import type { DropdownItem } from '@modekit/vue'
import { computed, ref } from 'vue'

const showToolbar = ref(true)
const density = ref('comfortable')

const items = computed<readonly DropdownItem[]>(() => [
  {
    type: 'group',
    label: 'Visibility',
    items: [
      {
        type: 'checkbox',
        label: 'Show toolbar',
        checked: showToolbar.value,
        onCheckedChange: (checked) => (showToolbar.value = checked),
      },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Density',
    items: [
      {
        type: 'radio-group',
        value: density.value,
        onValueChange: (value) => (density.value = String(value)),
        items: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
        ],
      },
    ],
  },
])
<\x2Fscript>

<template>
  <MkDropdown :items="items">
    <MkButton>View options</MkButton>
  </MkDropdown>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDropdown, type DropdownItem } from '@modekit/vue'
import { computed, ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const showToolbar = ref(true)
const density = ref('comfortable')

const items = computed<readonly DropdownItem[]>(() => [
  {
    type: 'group',
    label: 'Visibility',
    items: [
      {
        type: 'checkbox',
        label: 'Show toolbar',
        checked: showToolbar.value,
        onCheckedChange: (checked) => (showToolbar.value = checked),
      },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Density',
    items: [
      {
        type: 'radio-group',
        value: density.value,
        onValueChange: (value) => (density.value = String(value)),
        items: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
        ],
      },
    ],
  },
])
</script>

<template>
  <MkDropdown :items="items" :portal="portalTarget">
    <MkButton>View options</MkButton>
  </MkDropdown>
</template>
