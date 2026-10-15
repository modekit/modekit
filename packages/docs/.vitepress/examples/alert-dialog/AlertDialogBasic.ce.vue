<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkAlertDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkAlertDialog
    title="Delete project?"
    description="This action permanently removes the project and all of its data."
    action-label="Delete project"
    @action="deleteProject"
  >
    <MkButton color="red">Delete project</MkButton>
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
    action-label="Delete project"
    description="This action permanently removes the project and all of its data."
    :portal="portalTarget"
    title="Delete project?"
  >
    <MkButton color="red">Delete project</MkButton>
  </MkAlertDialog>
</template>
