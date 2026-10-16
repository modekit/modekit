<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSwitch',
  content: '',
  controls: [],
})
</script>

<script setup lang="ts">
import { MkGrid, MkSwitch } from '@modekit/vue'
import { ref } from 'vue'

const customIcon = ref(true)
const savingPreference = ref(true)
const stateIcons = ref(false)
</script>

<template>
  <MkGrid gap="l">
    <MkSwitch
      v-model="stateIcons"
      align="left"
      description="The thumb icon follows the current boolean value."
      label="State-specific icons"
    >
      <template #checked-icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="m5 12 4 4L19 6" />
        </svg>
      </template>
      <template #unchecked-icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      </template>
    </MkSwitch>

    <MkSwitch
      v-model="customIcon"
      align="left"
      description="The generic thumb slot stays visible in both states."
      label="Persistent thumb icon"
    >
      <template #thumb>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.5A7 7 0 0 1 12 3Z" />
        </svg>
      </template>
    </MkSwitch>

    <MkSwitch
      v-model="savingPreference"
      loading
      align="left"
      description="Loading preserves the current value and prevents another toggle."
      label="Saving preference"
    />
  </MkGrid>
</template>
