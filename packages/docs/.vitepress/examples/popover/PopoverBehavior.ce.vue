<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  controls: [
    {
      prop: 'modal',
      label: 'Modal',
      defaultValue: false,
      options: [
        { label: 'false', value: false },
        { label: 'true', value: true },
      ],
    },
    {
      prop: 'dismissible',
      label: 'Dismissible',
      defaultValue: true,
      options: [
        { label: 'true', value: true },
        { label: 'false', value: false },
      ],
    },
  ],
  code: (previewState) => `<template>
  <MkPopover
    :modal="${String(previewState.modal)}"
    :dismissible="${String(previewState.dismissible)}"
  >
    <MkButton variant="outline">Open popover</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 15rem">
        <MkText size="sm">Use the button when outside dismissal is disabled.</MkText>
        <MkButton size="sm" @click="close">Close</MkButton>
      </MkGrid>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkGrid, MkPopover, MkText } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    modal?: boolean
    dismissible?: boolean
  }>(),
  {
    modal: false,
    dismissible: true,
  },
)
</script>

<template>
  <MkPopover :modal="props.modal" :dismissible="props.dismissible">
    <MkButton variant="outline">Open popover</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 15rem">
        <MkText size="sm">Use the button when outside dismissal is disabled.</MkText>
        <MkButton size="sm" @click="close">Close</MkButton>
      </MkGrid>
    </template>
  </MkPopover>
</template>
