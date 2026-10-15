<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDropdownItem',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkDropdown>
    <MkButton>File</MkButton>

    <template #content>
      <MkDropdownGroup>
        <MkDropdownItem>
          <template #leading><FilePlus /></template>
          New file
          <template #trailing>⌘N</template>
        </MkDropdownItem>
        <MkDropdownItem>
          <template #leading><Copy /></template>
          Make a copy
          <template #trailing>⌘D</template>
        </MkDropdownItem>
        <MkDropdownItem disabled>
          <template #leading><Archive /></template>
          Archive
        </MkDropdownItem>
      </MkDropdownGroup>
    </template>
  </MkDropdown>
</template>`,
})
</script>

<script setup lang="ts">
import { Archive, Copy, FilePlus } from '@lucide/vue'
import { MkButton, MkDropdown, MkDropdownGroup, MkDropdownItem } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkDropdown :portal="portalTarget">
    <MkButton>File</MkButton>

    <template #content>
      <MkDropdownGroup>
        <MkDropdownItem>
          <template #leading><FilePlus aria-hidden="true" /></template>
          New file
          <template #trailing>⌘N</template>
        </MkDropdownItem>
        <MkDropdownItem>
          <template #leading><Copy aria-hidden="true" /></template>
          Make a copy
          <template #trailing>⌘D</template>
        </MkDropdownItem>
        <MkDropdownItem disabled>
          <template #leading><Archive aria-hidden="true" /></template>
          Archive
        </MkDropdownItem>
      </MkDropdownGroup>
    </template>
  </MkDropdown>
</template>
