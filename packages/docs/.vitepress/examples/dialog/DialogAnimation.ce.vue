<script lang="ts">
import { dialogAnimations } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'animation',
      label: 'Animation',
      defaultValue: 'scale',
      options: selectOptions(dialogAnimations),
    },
  ],
  code: (values) => `<template>
  <MkDialog
    title="Animation preview"
    description="Choose how the panel enters and leaves."
    animation="${String(values.animation)}"
  >
    <MkButton variant="outline">Open ${String(values.animation)} dialog</MkButton>

    <template #content>
      <MkText>
        Scale motion grows from the panel center; slide variants move on the vertical axis.
      </MkText>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDialog, MkText } from '@modekit/vue'
import type { DialogAnimation } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const props = withDefaults(defineProps<{ animation?: DialogAnimation }>(), { animation: 'scale' })
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkDialog
    :animation="props.animation"
    description="Choose how the panel enters and leaves."
    :portal="portalTarget"
    title="Animation preview"
  >
    <MkButton variant="outline">Open {{ props.animation }} dialog</MkButton>

    <template #content>
      <MkText>
        Scale motion grows from the panel center; slide variants move on the vertical axis.
      </MkText>
    </template>
  </MkDialog>
</template>
