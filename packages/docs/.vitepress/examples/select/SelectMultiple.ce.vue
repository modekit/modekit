<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSelect',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
import type { SelectItem } from '@modekit/vue'
import { ref } from 'vue'

const channels = ref(['email', 'push'])
const items = [
  { label: 'Email', value: 'email' },
  { label: 'Push notification', value: 'push' },
  { label: 'SMS', value: 'sms' },
  { label: 'Weekly digest', value: 'digest' },
] satisfies readonly SelectItem[]
<\x2Fscript>

<template>
  <MkSelect
    v-model="channels"
    :items="items"
    multiple
    placeholder="Select channels"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkSelect, MkText } from '@modekit/vue'
import type { SelectItem } from '@modekit/vue'
import { ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const channels = ref(['email', 'push'])
const items = [
  { label: 'Email', value: 'email' },
  { label: 'Push notification', value: 'push' },
  { label: 'SMS', value: 'sms' },
  { label: 'Weekly digest', value: 'digest' },
] satisfies readonly SelectItem[]
</script>

<template>
  <div style="display: grid; width: min(100%, 20rem); gap: 0.5rem">
    <MkSelect
      v-model="channels"
      aria-label="Notification channels"
      :items="items"
      multiple
      placeholder="Select channels"
      :portal="portalTarget"
    />
    <MkText size="xs">Selected: {{ channels.join(', ') || 'None' }}</MkText>
  </div>
</template>
