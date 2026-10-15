<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSheet',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkSheet
    title="Project activity"
    description="Review recent changes and manage notifications."
  >
    <MkButton variant="outline">View activity</MkButton>

    <template #actions="{ close }">
      <MkButton size="xs" variant="ghost" @click="close">Mark read</MkButton>
    </template>

    <template #content>
      <MkGrid gap="m">
        <MkCallout title="Deployment complete">Production was updated successfully.</MkCallout>
        <MkCallout title="Two new comments" color="blue">Open the review to reply.</MkCallout>
      </MkGrid>
    </template>
  </MkSheet>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkCallout, MkGrid, MkSheet } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkSheet
    description="Review recent changes and manage notifications."
    :portal="portalTarget"
    title="Project activity"
  >
    <MkButton variant="outline">View activity</MkButton>

    <template #actions="{ close }">
      <MkButton size="xs" variant="ghost" @click="close">Mark read</MkButton>
    </template>

    <template #content>
      <MkGrid gap="m">
        <MkCallout title="Deployment complete">Production was updated successfully.</MkCallout>
        <MkCallout color="blue" title="Two new comments">Open the review to reply.</MkCallout>
      </MkGrid>
    </template>
  </MkSheet>
</template>
