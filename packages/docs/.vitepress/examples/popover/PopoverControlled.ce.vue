<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
<\x2Fscript>

<template>
  <MkPopover v-model:open="open">
    <MkButton variant="outline">{{ open ? 'Close' : 'Open' }} popover</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 14rem">
        <MkText size="sm">The parent owns the open state.</MkText>
        <MkButton size="sm" variant="soft" @click="close">Close</MkButton>
      </MkGrid>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkGrid, MkPopover, MkText } from '@modekit/vue'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MkPopover v-model:open="open">
    <MkButton variant="outline">{{ open ? 'Close' : 'Open' }} popover</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 14rem">
        <MkText size="sm">The parent owns the open state.</MkText>
        <MkButton size="sm" variant="soft" @click="close">Close</MkButton>
      </MkGrid>
    </template>
  </MkPopover>
</template>
