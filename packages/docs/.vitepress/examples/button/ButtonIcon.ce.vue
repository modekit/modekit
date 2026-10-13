<script lang="ts">
import { buttonSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkButton',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(buttonSizes),
    },
  ],
  code: (values) => {
    const size = String(values.size ?? 'md')

    return `<script setup lang="ts">
import { ChevronDown, Download, Ellipsis } from '@lucide/vue'
import { MkButton } from '@modekit/vue'
${scriptEnd}

<template>
  <MkButton size="${size}">
    <template #leading><Download aria-hidden="true" /></template>
    Export
  </MkButton>

  <MkButton size="${size}" variant="soft">
    Open
    <template #trailing><ChevronDown aria-hidden="true" /></template>
  </MkButton>

  <MkButton size="${size}" variant="soft" square aria-label="More actions">
    <Ellipsis aria-hidden="true" />
  </MkButton>
</template>`
  },
})
</script>

<script setup lang="ts">
import { ChevronDown, Download, Ellipsis } from '@lucide/vue'
import { MkButton } from '@modekit/vue'
import type { ButtonSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    size?: ButtonSize
  }>(),
  {
    size: 'md',
  },
)
</script>

<template>
  <div class="mk:flex mk:flex-wrap mk:items-center mk:gap-3">
    <MkButton :size="props.size">
      <template #leading><Download aria-hidden="true" /></template>
      Export
    </MkButton>

    <MkButton :size="props.size" variant="soft">
      Open
      <template #trailing><ChevronDown aria-hidden="true" /></template>
    </MkButton>

    <MkButton :size="props.size" variant="soft" square aria-label="More actions">
      <Ellipsis aria-hidden="true" />
    </MkButton>
  </div>
</template>
