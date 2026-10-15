<script lang="ts">
import { dialogSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(dialogSizes),
    },
  ],
  code: (values) => `<template>
  <MkDialog
    title="Team details"
    description="Review this workspace before inviting collaborators."
    size="${String(values.size)}"
  >
    <MkButton variant="outline">Open ${String(values.size)} dialog</MkButton>

    <template #content>
      <MkText>
        Dialog width follows a curated responsive scale while remaining within the viewport.
      </MkText>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDialog, MkText } from '@modekit/vue'
import type { DialogSize } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const props = withDefaults(defineProps<{ size?: DialogSize }>(), { size: 'md' })
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkDialog
    description="Review this workspace before inviting collaborators."
    :portal="portalTarget"
    :size="props.size"
    title="Team details"
  >
    <MkButton variant="outline">Open {{ props.size }} dialog</MkButton>

    <template #content>
      <MkText>
        Dialog width follows a curated responsive scale while remaining within the viewport.
      </MkText>
    </template>
  </MkDialog>
</template>
