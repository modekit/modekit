<script lang="ts">
import { sheetSides, sheetSizes, sheetVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSheet',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'right',
      options: selectOptions(sheetSides),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(sheetSizes),
    },
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'edge',
      options: selectOptions(sheetVariants),
    },
  ],
  code: (values) => `<template>
  <MkSheet
    title="${String(values.variant)} ${String(values.side)} sheet"
    description="Sheet sizing follows the axis of its selected edge."
    side="${String(values.side)}"
    size="${String(values.size)}"
    variant="${String(values.variant)}"
  >
    <MkButton variant="outline">Open ${String(values.size)} sheet</MkButton>

    <template #content>
      <MkText>
        Side sheets use a width scale. Top and bottom sheets use a maximum-height scale.
      </MkText>
    </template>
  </MkSheet>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkSheet, MkText } from '@modekit/vue'
import type { SheetSide, SheetSize, SheetVariant } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const props = withDefaults(
  defineProps<{ side?: SheetSide; size?: SheetSize; variant?: SheetVariant }>(),
  {
    side: 'right',
    size: 'md',
    variant: 'edge',
  },
)
const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkSheet
    description="Sheet sizing follows the axis of its selected edge."
    :portal="portalTarget"
    :side="props.side"
    :size="props.size"
    :title="`${props.variant} ${props.side} sheet`"
    :variant="props.variant"
  >
    <MkButton variant="outline">Open {{ props.size }} sheet</MkButton>

    <template #content>
      <MkText>
        Side sheets use a width scale. Top and bottom sheets use a maximum-height scale.
      </MkText>
    </template>
  </MkSheet>
</template>
