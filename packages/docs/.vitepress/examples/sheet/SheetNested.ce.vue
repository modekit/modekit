<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSheet',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkSheet
    side="bottom"
    size="sm"
    title="Project actions"
    description="Choose an action or open its details."
  >
    <MkButton variant="outline">Open actions</MkButton>

    <template #content>
      <MkText>Select an action for the current project.</MkText>
    </template>

    <template #footer>
      <MkSheet
        side="right"
        size="sm"
        variant="inset"
        title="Archive project"
        description="Archived projects remain available to workspace owners."
      >
        <MkButton color="amber" variant="soft">Archive details</MkButton>

        <template #content>
          <MkCallout color="amber" title="Before archiving">
            Active automations will be paused.
          </MkCallout>
        </template>
      </MkSheet>
    </template>
  </MkSheet>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkCallout, MkSheet, MkText } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkSheet
    description="Choose an action or open its details."
    :portal="portalTarget"
    side="bottom"
    size="sm"
    title="Project actions"
  >
    <MkButton variant="outline">Open actions</MkButton>

    <template #content>
      <MkText>Select an action for the current project.</MkText>
    </template>

    <template #footer>
      <MkSheet
        description="Archived projects remain available to workspace owners."
        :portal="portalTarget"
        side="right"
        size="sm"
        title="Archive project"
        variant="inset"
      >
        <MkButton color="amber" variant="soft">Archive details</MkButton>

        <template #content>
          <MkCallout color="amber" title="Before archiving">
            Active automations will be paused.
          </MkCallout>
        </template>
      </MkSheet>
    </template>
  </MkSheet>
</template>
