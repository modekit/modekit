<script lang="ts">
import { calloutSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCallout',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(calloutSizes),
    },
  ],
  code: (values) => `<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
${scriptEnd}

<template>
  <MkCallout
    size="${String(values.size)}"
    color="primary"
    title="Storage almost full"
  >
    <template #icon>
      <TriangleAlert aria-hidden="true" :stroke-width="1.75" />
    </template>

    Remove unused files to keep uploads available.
  </MkCallout>
</template>`,
})
</script>

<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
import type { CalloutSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    size?: CalloutSize
  }>(),
  {
    size: 'md',
  },
)
</script>

<template>
  <MkCallout
    :size="props.size"
    color="primary"
    title="Storage almost full"
    style="width: min(100%, 36rem)"
  >
    <template #icon>
      <TriangleAlert aria-hidden="true" :stroke-width="1.75" />
    </template>

    Remove unused files to keep uploads available.
  </MkCallout>
</template>
