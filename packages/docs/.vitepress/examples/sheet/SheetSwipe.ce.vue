<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSheet',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkSheet
    handle
    side="bottom"
    size="sm"
    title="Quick actions"
    description="Drag downward or use an explicit action to close."
  >
    <MkButton variant="outline">Open quick actions</MkButton>

    <template #content="{ close }">
      <MkGrid gap="s">
        <MkButton variant="outline" @click="close">Duplicate project</MkButton>
        <MkButton variant="outline" @click="close">Move to workspace</MkButton>
      </MkGrid>
    </template>
  </MkSheet>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkGrid, MkSheet } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkSheet
    description="Drag downward or use an explicit action to close."
    handle
    :portal="portalTarget"
    side="bottom"
    size="sm"
    title="Quick actions"
  >
    <MkButton variant="outline">Open quick actions</MkButton>

    <template #content="{ close }">
      <MkGrid gap="s">
        <MkButton variant="outline" @click="close">Duplicate project</MkButton>
        <MkButton variant="outline" @click="close">Move to workspace</MkButton>
      </MkGrid>
    </template>
  </MkSheet>
</template>
