<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkDialog
    :close-button="false"
    :dismissible="false"
    title="Required review"
    description="Escape and outside interaction cannot dismiss this workflow."
  >
    <MkButton variant="outline">Start review</MkButton>

    <template #content>
      <MkCallout title="Explicit completion required" color="amber">
        Review the pending access changes before continuing.
      </MkCallout>
    </template>

    <template #footer="{ close }">
      <MkButton @click="close">Review complete</MkButton>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkCallout, MkDialog } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkDialog
    :close-button="false"
    description="Escape and outside interaction cannot dismiss this workflow."
    :dismissible="false"
    :portal="portalTarget"
    title="Required review"
  >
    <MkButton variant="outline">Start review</MkButton>

    <template #content>
      <MkCallout color="amber" title="Explicit completion required">
        Review the pending access changes before continuing.
      </MkCallout>
    </template>

    <template #footer="{ close }">
      <MkButton @click="close">Review complete</MkButton>
    </template>
  </MkDialog>
</template>
