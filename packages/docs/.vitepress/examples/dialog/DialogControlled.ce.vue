<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
<\x2Fscript>

<template>
  <MkGrid gap="m" justify="center">
    <MkText size="sm">State: {{ open ? 'open' : 'closed' }}</MkText>
    <MkButton @click="open = true">Open from state</MkButton>
  </MkGrid>

  <MkDialog
    v-model:open="open"
    title="Controlled dialog"
    description="Application state owns this dialog, so a trigger slot is optional."
  >
    <template #content>
      <MkText>The same update event is emitted for Escape, outside clicks, and close actions.</MkText>
    </template>
    <template #footer="{ close }">
      <MkButton @click="close">Done</MkButton>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDialog, MkGrid, MkText } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const open = ref(false)
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkGrid gap="m" justify="center">
    <MkText size="sm">State: {{ open ? 'open' : 'closed' }}</MkText>
    <MkButton @click="open = true">Open from state</MkButton>
  </MkGrid>

  <MkDialog
    v-model:open="open"
    description="Application state owns this dialog, so a trigger slot is optional."
    :portal="portalTarget"
    title="Controlled dialog"
  >
    <template #content>
      <MkText
        >The same update event is emitted for Escape, outside clicks, and close actions.</MkText
      >
    </template>
    <template #footer="{ close }">
      <MkButton @click="close">Done</MkButton>
    </template>
  </MkDialog>
</template>
