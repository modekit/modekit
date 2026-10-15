<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkDialog
    :unmount-on-hide="false"
    title="Draft message"
    description="Close and reopen the dialog to see the local input state persist."
  >
    <MkButton variant="outline">Write message</MkButton>

    <template #content>
      <MkGrid gap="s">
        <MkLabel for="draft-subject">Subject</MkLabel>
        <MkInput id="draft-subject" placeholder="Type a subject, then reopen" />
      </MkGrid>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDialog, MkGrid, MkInput, MkLabel } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkDialog
    description="Close and reopen the dialog to see the local input state persist."
    :portal="portalTarget"
    title="Draft message"
    :unmount-on-hide="false"
  >
    <MkButton variant="outline">Write message</MkButton>

    <template #content>
      <MkGrid gap="s">
        <MkLabel for="draft-subject">Subject</MkLabel>
        <MkInput id="draft-subject" placeholder="Type a subject, then reopen" />
      </MkGrid>
    </template>
  </MkDialog>
</template>
