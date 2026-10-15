<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSheet',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkSheet
    title="Edit project"
    description="Update the details shown to collaborators."
  >
    <MkButton>Edit project</MkButton>

    <template #content>
      <MkGrid gap="l">
        <MkGrid gap="s">
          <MkLabel for="sheet-name">Project name</MkLabel>
          <MkInput id="sheet-name" default-value="ModeKit" />
        </MkGrid>
        <MkGrid gap="s">
          <MkLabel for="sheet-owner">Owner</MkLabel>
          <MkInput id="sheet-owner" default-value="Maya Chen" />
        </MkGrid>
      </MkGrid>
    </template>

    <template #footer="{ close }">
      <MkButton variant="ghost" @click="close">Cancel</MkButton>
      <MkButton @click="close">Save changes</MkButton>
    </template>
  </MkSheet>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkGrid, MkInput, MkLabel, MkSheet } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkSheet
    description="Update the details shown to collaborators."
    :portal="portalTarget"
    title="Edit project"
  >
    <MkButton>Edit project</MkButton>

    <template #content>
      <MkGrid gap="l">
        <MkGrid gap="s">
          <MkLabel for="sheet-name">Project name</MkLabel>
          <MkInput id="sheet-name" default-value="ModeKit" />
        </MkGrid>
        <MkGrid gap="s">
          <MkLabel for="sheet-owner">Owner</MkLabel>
          <MkInput id="sheet-owner" default-value="Maya Chen" />
        </MkGrid>
      </MkGrid>
    </template>

    <template #footer="{ close }">
      <MkButton variant="ghost" @click="close">Cancel</MkButton>
      <MkButton @click="close">Save changes</MkButton>
    </template>
  </MkSheet>
</template>
