<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDropdown',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import type { DropdownItem } from '@modekit/vue'

const items = [
  { label: 'Edit project', color: 'blue' },
  { label: 'Duplicate' },
  { label: 'Archive', disabled: true },
  { label: 'Delete project', color: 'red' },
] satisfies readonly DropdownItem[]
<\x2Fscript>

<template>
  <MkDropdown :items="items">
    <MkButton>Actions</MkButton>
  </MkDropdown>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDropdown, type DropdownItem } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const items = [
  { label: 'Edit project', color: 'blue' },
  { label: 'Duplicate' },
  { label: 'Archive', disabled: true },
  { label: 'Delete project', color: 'red' },
] satisfies readonly DropdownItem[]
</script>

<template>
  <MkDropdown :items="items" :portal="portalTarget">
    <MkButton>Actions</MkButton>
  </MkDropdown>
</template>
