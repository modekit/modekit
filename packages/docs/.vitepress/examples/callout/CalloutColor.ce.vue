<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCallout',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { Info } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
${scriptEnd}

<template>
  <MkCallout
    color="primary"
    title="Account notification"
  >
    <template #icon>
      <Info aria-hidden="true" :stroke-width="1.75" />
    </template>

    Review the latest activity associated with your account.
  </MkCallout>
</template>`,
})
</script>

<script setup lang="ts">
import { Info } from '@lucide/vue'
import { MkCallout } from '@modekit/vue'
import type { CalloutColor } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: CalloutColor
  }>(),
  {
    color: 'primary',
  },
)
</script>

<template>
  <MkCallout :color="props.color" title="Account notification" style="width: min(100%, 36rem)">
    <template #icon>
      <Info aria-hidden="true" :stroke-width="1.75" />
    </template>

    Review the latest activity associated with your account.
  </MkCallout>
</template>
