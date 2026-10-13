<script lang="ts">
import { calloutColors, calloutVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCallout',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'soft',
      options: selectOptions(calloutVariants),
    },
    {
      prop: 'color',
      label: 'Color',
      defaultValue: 'green',
      options: selectOptions(calloutColors),
    },
  ],
  code: (values) => `<script setup lang="ts">
import { CircleCheck } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
${scriptEnd}

<template>
  <MkCallout
    color="${String(values.color)}"
    variant="${String(values.variant)}"
    title="Changes saved"
  >
    <template #icon>
      <CircleCheck aria-hidden="true" :stroke-width="1.75" />
    </template>

    Your preferences are now up to date.
  </MkCallout>
</template>`,
})
</script>

<script setup lang="ts">
import { CircleCheck } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
import type { CalloutColor, CalloutVariant } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: CalloutColor
    variant?: CalloutVariant
  }>(),
  {
    color: 'green',
    variant: 'soft',
  },
)
</script>

<template>
  <MkCallout
    :color="props.color"
    :variant="props.variant"
    title="Changes saved"
    style="width: min(100%, 36rem)"
  >
    <template #icon>
      <CircleCheck aria-hidden="true" :stroke-width="1.75" />
    </template>

    Your preferences are now up to date.
  </MkCallout>
</template>
