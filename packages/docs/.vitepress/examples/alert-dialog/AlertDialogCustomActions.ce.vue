<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAlertDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkAlertDialog
    title="Publish this release?"
    description="Subscribers will immediately receive a release notification."
  >
    <MkButton>Publish release</MkButton>

    <template #cancel>
      <MkButton variant="outline">Review again</MkButton>
    </template>
    <template #action>
      <MkButton color="green">Publish now</MkButton>
    </template>
  </MkAlertDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkAlertDialog, MkButton } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkAlertDialog
    description="Subscribers will immediately receive a release notification."
    :portal="portalTarget"
    title="Publish this release?"
  >
    <MkButton>Publish release</MkButton>

    <template #cancel>
      <MkButton variant="outline">Review again</MkButton>
    </template>
    <template #action>
      <MkButton color="green">Publish now</MkButton>
    </template>
  </MkAlertDialog>
</template>
