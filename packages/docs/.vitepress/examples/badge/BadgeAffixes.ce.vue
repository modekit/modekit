<script lang="ts">
import { badgeSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkBadge',
  content: '',
  controls: [
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(badgeSizes),
    },
  ],
  code: (values) => `<script setup lang="ts">
import { Check, Sparkles } from '@lucide/vue'
${scriptEnd}

<template>
  <MkBadge color="primary" size="${String(values.size)}">
    <template #leading><Check /></template>
    Verified
  </MkBadge>

  <MkBadge color="primary" variant="soft" size="${String(values.size)}">
    Featured
    <template #trailing><Sparkles /></template>
  </MkBadge>
</template>`,
})
</script>

<script setup lang="ts">
import { Check, Sparkles } from '@lucide/vue'
import { MkBadge } from '@modekit/vue'
import type { BadgeColor, BadgeSize } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
    size?: BadgeSize
  }>(),
  {
    color: 'primary',
    size: 'md',
  },
)
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem">
    <MkBadge :color="props.color" :size="props.size">
      <template #leading>
        <Check aria-hidden="true" />
      </template>
      Verified
    </MkBadge>

    <MkBadge :color="props.color" :size="props.size" variant="soft">
      Featured
      <template #trailing>
        <Sparkles aria-hidden="true" />
      </template>
    </MkBadge>
  </div>
</template>
