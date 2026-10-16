<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkRadioGroup',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const theme = ref('system')
const themes = [
  { label: 'System', value: 'system', description: 'Matches your device settings.' },
  { label: 'Light', value: 'light', description: 'Always uses the light theme.' },
  { label: 'Dark', value: 'dark', description: 'Always uses the dark theme.' },
]
${scriptEnd}

<template>
  <MkRadioGroup
    v-model="theme"
    :items="themes"
    label="Interface theme"
    variant="table"
  />
</template>`,
})
</script>

<script setup lang="ts">
import { MkRadioGroup } from '@modekit/vue'
import { ref } from 'vue'

const theme = ref('system')
const themes = [
  { label: 'System', value: 'system', description: 'Matches your device settings.' },
  { label: 'Light', value: 'light', description: 'Always uses the light theme.' },
  { label: 'Dark', value: 'dark', description: 'Always uses the dark theme.' },
]
</script>

<template>
  <MkRadioGroup
    v-model="theme"
    :items="themes"
    label="Interface theme"
    style="width: min(100%, 22rem)"
    variant="table"
  />
</template>
