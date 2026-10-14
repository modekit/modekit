<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkSeparator',
  content: '',
  controls: [],
  code: () => `<template>
  <MkFlex gap="l">
    <MkButton variant="soft">Save draft</MkButton>
    <MkSeparator orientation="vertical" />
    <MkButton>Publish</MkButton>
  </MkFlex>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkFlex, MkSeparator } from '@modekit/vue'
</script>

<template>
  <MkFlex gap="l">
    <MkButton variant="soft">Save draft</MkButton>
    <MkSeparator orientation="vertical" />
    <MkButton>Publish</MkButton>
  </MkFlex>
</template>
